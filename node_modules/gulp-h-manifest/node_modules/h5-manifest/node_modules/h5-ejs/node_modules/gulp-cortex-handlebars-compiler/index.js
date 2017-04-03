'use strict';

module.exports = compiler;

var PluginError = require('gulp-util').PluginError;
var fs = require('fs');
var through = require('through2');
var node_path = require('path');
var handlebars_compiler = require('cortex-handlebars-compiler');
var cortex_json = require('read-cortex-json');
var events = require('events').EventEmitter;
var util = require('util');
var async = require('async');
var jf = require('jsonfile');
var ngraph = require('neuron-graph');
var semver = require('semver-extra');
var _ = require('underscore');

function compiler (options){
  return new Compiler(options || {});
};

function Compiler (options) {
  if(options.html_root){
    console.error("`html_root` is not supported anymore, see: https://github.com/cortexjs/gulp-cortex-handlebars-compiler/issues/3");
    process.exit(1);
  }
  this.cwd = options.cwd || process.cwd();
  this.href_root = options.href_root || '';
  this.mod_root = options.mod_root || '';
  this.hash_host = options.hash_host;
  this.template_dir = options.template_dir ? node_path.join(this.cwd, options.template_dir) : null;
  this.jsons = {};
  this.hosts = options.hosts;
  this.data = options.data;
}

util.inherits(Compiler, events);

Compiler.prototype.compile = function() {
  var self = this;
  return through.obj(function (file, enc, callback) {
    if(file.isStream()){
      this.emit('error', new PluginError('gulp-cortex-handlebars-compiler', 'Streaming not supported'));
      return callback();
    }

    self._render(file.path, String(file.contents), function (err, rendered) {
      if (err) {
        this.emit('error', err);
        return callback();
      }

      file.contents = new Buffer(rendered);
      this.push(file);
      callback();

    }.bind(this));
  });
};

Compiler.prototype._render = function(path, template, callback) {
  var self = this;
  this._gather_info(template, function (err, pkg, graph, shrinkwrap) {
    if (err) {
      return callback(err);
    }

    self._read_facades(template, function(err, facades){
      if(err){
        return callback(err);
      }
      var compiled;
      try {
        self._improve_graph(graph, pkg, facades);

        compiled = handlebars_compiler({
          hosts: self.hosts,
          pkg: pkg,
          graph: graph,
          facades: facades,
          cwd: self.cwd,
          shrinkwrap: shrinkwrap,
          path: path,
          template_dir: self.template_dir,
          mod_root: self.mod_root,
          href_root: self.href_root,
          hash_host: self.hash_host
        }).compile(template);
      } catch(e) {
        return callback(e);
      }

      var ENV = process.env.ENV;
      var data = _.extend(self.data, {
        __DEV__:  !ENV || ENV == 'dev',
        __ENV_ALPHA__:  ENV == 'alpha',
        __ENV_BETA__:  ENV == 'beta',
        __ENV_PRODUCT__:  ENV == 'product',
        __ENV_PRELEASE__:  ENV == 'prelease',
        __TEST__: ENV && /alpha|beta/.test(ENV),
        __PRODUCT___: ENV && /product|prelease/.test(ENV)
      });
      var rendered = compiled(data);
      callback(null, rendered);
    });
  }.bind(this));
};

Compiler.prototype._gather_info = function(template, callback) {
  function cb (pkg, graph, shrinkwrap) {
    var version = process.env.NEURON_VERSION;
    var exec = require('child_process').exec;

    function makeResult(v){
      if (!shrinkwrap.engines && v) {
        shrinkwrap.engines = {
          'neuron': {
            'from': 'neuron@' + v,
            'version': v
          }
        };
      }else if(!v){
        callback("NEURON_VERSION should be exported");
      }
      callback(null, pkg, graph, shrinkwrap);
    }

    if(!version){
      exec('cortex neuron-version', function(err, v){
        if(err){return callback(err)}
        var version = process.env.NEURON_VERSION = v.trim();
        makeResult(version);
      });
    }else{
        makeResult(version);
    }
  }

  if (this.pkg && this.graph && this.shrinkwrap) {
    return cb(this.pkg, this.graph, this.shrinkwrap);
  }

  var self = this;
  this._read_pkg(function (err, pkg) {
    if (err) {
      return callback(err);
    }

    var pr = process.env.CORTEX_BUILD_PRERELEASE;
    if (pr && pr !== "product") {
      var s = semver.parse(pkg.version);
      s.prerelease.length = 0;
      s.prerelease.push(pr);
      pkg.version = s.format();
    }

    self._read_graph(pkg, function (err, graph, shrinkwrap) {
      if (err) {
        return callback(err);
      }

      self.pkg = pkg;
      self.graph = graph;
      self.shrinkwrap = shrinkwrap;

      cb(self.pkg, graph, shrinkwrap);
    });
  });
};

Compiler.prototype._read_facades = function(content, callback){
  var regexp_comments = /<!--[\s\S]*?-->/g;
  var regexp = /\{\{\{facade\s([\'\"])([\w\@\.\d-_\/]+)\1\s*\}\}\}/g
  var match_comment,m;
  var facades = [];

  while(match_comment = regexp_comments.exec(content)){
    content = content.replace(regexp_comments,'');
  }

  while(m = regexp.exec(content)){
    facades.push(m[2]);
  }
  callback(null, facades);
}

Compiler.prototype._read_pkg = function (callback) {
  this._read_json(this.cwd, function (path, done) {
    cortex_json.read(path, done);
  }, callback);
};


Compiler.prototype._read_graph = function(pkg, callback) {
  ngraph(pkg, {
    cwd: this.cwd,
    built_root: node_path.join(this.cwd, process.env.CORTEX_DEST || 'neurons'),
    dependencyKeys: ['dependencies', 'asyncDependencies']
  }, callback);
};


Compiler.prototype._improve_graph = function(graph, pkg, facades) {
  var self = this;
  var _ = graph._;
  var main_id = _[pkg.name + '@' + pkg.version];
  _[pkg.name + '@*'] = _[pkg.name + '@' + pkg.version];

  facades.forEach(function(facade){
    if(self._parse_module(facade).name == pkg.name){
      return;
    }
    facade = facade.split("@").length > 1 ? facade : (facade + "@*");
    _[facade] = self._find_module_id(graph[main_id][1], facade);
  });
};

Compiler.prototype._parse_module = function(module){
  var module_id = module.split("/")[0];
  var module_path = module.split("/")[1];
  var module_name = module_id.split("@")[0];
  var module_version = module_id.split("@")[1] || "*";
  return {
    name: module_name,
    version: module_version,
    path: module_path
  };
}

Compiler.prototype._find_module_id = function(subgraph, facade){
  var facade_mod = this._parse_module(facade);

  for(var key in subgraph){
    var current_mod = this._parse_module(key);
    if(current_mod.name !== facade_mod.name){
      continue;
    }

    if(facade_mod.version == "*" || semver.satisfies(facade_mod.version, current_mod.version)){
      return subgraph[key];
    }
  }
  throw util.format("ERR: Module %s not found, please install it first", facade);
}


// Queue the read process
Compiler.prototype._read_json = function (path, handler, callback) {
  var json = this.jsons[path];
  if (json) {
    return callback(null, json);
  }

  var event = 'json:' + path;
  var count = events.listenerCount(this, event);
  this.once(event, callback);

  var self = this;
  if (count === 0) {
    handler(path, function (err, json) {
      if (!err) {
        self.jsons[path] = json;
      }
      self.emit(event, err, json);
    });
  }
};

