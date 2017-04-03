'use strict';

var expect = require('chai').expect;
var helper = require('../');
var cleaner = require('../lib/cleaner');

var tmp = require('./lib/tmp');
var fs = require('fs-sync');
var util = require('util');
var temp = require('tmp');
var _ = require('underscore');

var node_path = require('path');
var packages = require('cortex-playground').packages;

var root = node_path.resolve('test', 'playground', 'tmp');
var fixtures = node_path.resolve('test', 'fixtures');

var only_package = make(['package.json']);
var hybrid = make(['package.json', 'cortex.json']);
var non_existing = make([]);

function fix () {
  var base = fixtures;
  _.toArray(arguments).forEach(function (p) {
    base = node_path.join(base, p);
  });

  return base;
}

function make(files) {
  var dir = tmp.make(root);

  files.forEach(function(file) {
    copy(file, fixtures, dir);
  });

  return dir;
}

function copy(file, from, to) {
  fs.copy(node_path.join(from, file), node_path.join(to, file), {
    force: true
  });
}


describe("helper._get_package_file(cwd)", function() {
  it("helper._is_cortex_json", function() {
    expect(helper._is_cortex_json('/xxx/xxx/xx/cortex.json')).to.equal(true);
    expect(helper._is_cortex_json('/xxx/xxx/xx/package.json')).to.equal(false);
  });

  it("returns package.json if cortex.json is not existed", function(done) {
    helper._get_package_file(only_package, function(err, file) {
      expect(err).to.equal(null);
      expect(helper._is_cortex_json(file)).to.equal(false);

      done();
    });
  });

  it("returns cortex.json if existed", function(done) {
    helper._get_package_file(hybrid, function(err, file) {
      expect(err).to.equal(null);
      expect(helper._is_cortex_json(file)).to.equal(true);
      done();
    });
  });

  it("throws error if neither is existed, strict=true", function(done) {
    helper._get_package_file(non_existing, function(err, file) {
      expect(err).not.to.equal(null);
      done();
    }, true);
  });

  it("won't throw error if neither is existed, strict=", function(done) {
    helper._get_package_file(non_existing, function(err, file) {
      expect(err).to.equal(null);
      done();
    });
  });
});


describe("helper.read(cwd)", function() {
  it("merges normal fields", function(done) {
    helper.read(only_package, function(err, helper) {
      expect(helper.name).to.equal('foo');
      done();
    });
  });

  it("prevents merging special fields", function(done) {
    helper.read(only_package, function(err, helper) {
      expect(helper.scripts.prebuild).to.equal(undefined);
      expect(helper.dependencies.baar).to.equal(undefined);
      expect(helper.dependencies.bar).not.to.equal(undefined);
      expect(helper.engines.node).to.equal(undefined);
      done();
    });
  });

  it("use_inherits=true", function(done) {
    helper.read(only_package, function(err, helper) {
      expect(helper.hasOwnProperty('name')).to.equal(false);
      done();
    }, true);
  });
});


describe("helper.save(cwd, json)", function() {
  var new_version = '10.3.4';

  it("could save to cortex.json", function(done) {
    var dir = make(['cortex.json']);

    helper.read(dir, function(err, pkg) {
      pkg.version = new_version;

      helper.save(dir, pkg, function(err) {
        expect(err).to.equal(null);
        var json = fs.readJSON(node_path.join(dir, 'cortex.json'));

        expect(json.version).to.equal(new_version);
        done();
      });
    });
  });

  it("will save to package.json if cortex.json is not existed", function(done) {
    var dir = make(['package.json']);

    helper.read(dir, function(err, pkg) {
      pkg.version = new_version;

      helper.save(dir, pkg, function(err) {
        expect(err).to.equal(null);
        var json = fs.readJSON(node_path.join(dir, 'package.json'));

        expect(json.cortex.version).to.equal(new_version);

        // should not affect pkg.version
        expect(json.version).not.to.equal(new_version);
        done();
      });
    }, true);
  });

  it("save to cortex.json if both exists", function(done) {
    var dir = make(['package.json', 'cortex.json']);

    helper.read(dir, function(err, pkg) {
      pkg.version = new_version;

      helper.save(dir, pkg, function(err) {
        expect(err).to.equal(null);
        var json = fs.readJSON(node_path.join(dir, 'cortex.json'));

        // should not affect pkg.version
        expect(json.version).to.equal(new_version);
        expect('cortex' in json).to.equal(false);

        done();
      });
    });
  });
});


describe("helper.package_root()", function() {
  it("current", function(done) {
    var dir = fix('a');
    helper.package_root(dir, function (found) {
      expect(found).to.equal(dir);
      done();
    })
  });

  it("found cortex.json", function(done){
    var dir = fix('a', 'a');
    var expected = fix('a');
    helper.package_root(dir, function (found) {
      expect(found).to.equal(expected);
      done();
    })
  });

  it("found package.json", function(done){
    var dir = fix('b');
    helper.package_root(dir, function (found) {
      expect(found).to.equal(dir);
      done();
    });
  });

  it("not found", function(done){
    temp.dir(function (err, dir) {
      if (err) {
        console.error('fail to create tmp dir, skip testing');
        return done();
      }

      helper.package_root(dir, function (found) {
        expect(found).to.equal(null);
        done();
      })
    })
  });
});


describe("cleaner", function(){
  it("cleaner.clean_pkg_css(): should throw if css not found", function(done){
    var p = packages('css-not-found');
    p.copy(function (err, dir) {
      expect(err).to.equal(null);
      helper.read(dir, function (err, json) {
        expect(err).to.equal(null);
        cleaner.clean_pkg_css(dir, json, function (err, json) {
          expect(err).not.to.equal(null);
          expect(err.code).to.equal('CORTEX_CSS_NOT_FOUND');
          done();
        });
      });
    });
  });

  it("if a package has nothing, it will fail", function(done){
    var p = packages('dir-not-found');
    p.copy(function (err, dir) {
      expect(err).to.equal(null);
      var cortex_json = node_path.join(dir, 'cortex.json');
      fs.write(cortex_json, JSON.stringify({name: 'a', version: '1.1.0'}));
      var index = node_path.join(dir, 'index.js');
      fs.remove(index);

      function cb () {
        counter --;
        if (!counter) {
          done();
        }
      }

      var counter = 2;
      helper.enhanced(dir, function (err, json) {
        expect(err).not.to.equal(null);
        expect(err.code).to.equal('CORTEX_NO_ENTRY');
        cb();
      });

      helper.extra(dir, function (err, json) {
        expect(err).to.equal(null);
        cb();
      });
    });
  });

  it("`pkg.main` should always exist, it main not exists, it should be false", function(done){
    var p = packages('simplest');
    p.copy(function (err, dir) {
      var cortex_json = node_path.join(dir, 'cortex.json');
      var json = fs.readJSON(cortex_json);
      json.css = ['style.css'];
      delete json.main;
      fs.write(cortex_json, JSON.stringify(json, null, 2));
      fs.write(node_path.join(dir, 'style.css'), '');
      var index = node_path.join(dir, 'index.js');
      fs.remove(index);

      function cb () {
        counter --;
        if (!counter) {
          done();
        }
      }

      var counter = 2;
      helper.enhanced(dir, function (err, pkg) {
        expect('main' in pkg).to.equal(true);
        expect(pkg.main).to.equal(false);
        cb();
      });

      helper.extra(dir, function (err, pkg) {
        expect('main' in pkg).to.equal(false);
        cb();
      });
    });
  });

  it("`pkg.css` should always be an array", function(done){
    var p = packages('simplest');
    p.copy(function (err, dir) {
      function cb () {
        counter --;
        if (!counter) {
          done();
        }
      }

      var counter = 2;
      helper.enhanced(dir, function (err, pkg) {
        expect(util.isArray(pkg.css)).to.equal(true);
        cb();
      });

      helper.extra(dir, function (err, pkg) {
        expect(util.isArray(pkg.css)).to.equal(false);
        cb();
      });
    });
  });

  it("`pkg.entries` should always be an array", function(done){
    var p = packages('simplest');
    p.copy(function (err, dir) {
      function cb () {
        counter --;
        if (!counter) {
          done();
        }
      }

      var counter = 2;
      helper.enhanced(dir, function (err, pkg) {
        expect(util.isArray(pkg.entries)).to.equal(true);
        cb();
      });

      helper.extra(dir, function (err, pkg) {
        expect(util.isArray(pkg.entries)).to.equal(false);
        cb();
      });
    });
  });

  it("#18: name and version", function(done){
    var pkg = {};
    cleaner.clean(null, pkg, function (err) {
      expect(err).not.to.equal(null);
      expect(err.code).to.equal('NO_CORTEX_NAME_VERSION');
      done();
    });
  });
});

describe("#6", function(){
  it("enhance() should callback if no css", function(done){
    var p = packages('simplest');
    p.copy(function (err, dir) {
      helper.enhanced(dir, function () {
        done();
      });
    });
  });
});

describe("#8", function(){
  it("pkg.css should always be an array after enhanced", function(done){
    var p = packages('simplest');
    p.copy(function (err, dir) {
      function cb () {
        counter --;
        if (!counter) {
          done();
        }
      }

      var counter = 2;
      helper.enhanced(dir, function (err, pkg) {
        expect(util.isArray(pkg.css)).to.equal(true);
        cb();
      });

      helper.extra(dir, function (err, pkg) {
        expect(util.isArray(pkg.css)).to.equal(false);
        cb();
      });
    });
  });
});

describe("#10", function(){
  it("if pkg.main defined but not found, it will throw errors", function(done){
    var p = packages('simplest');
    p.copy(function (err, dir) {
      var main = node_path.join(dir, 'index.js');
      fs.remove(main);

      function cb () {
        counter --;
        if (!counter) {
          done();
        }
      }

      var counter = 2;
      helper.enhanced(dir, function (err, pkg) {
        expect(err.code).to.equal('CORTEX_MAIN_NOT_FOUND');
        cb();
      });

      helper.extra(dir, function (err, pkg) {
        expect(err).to.equal(null);
        cb();
      });
    });
  });

  it("if pkg.main not found, it will try to fallback to <name>.js", function(done){
    var p = packages('simplest');
    p.copy(function (err, dir) {
      var main = node_path.join(dir, 'index.js');
      fs.remove(main);
      helper.read(dir, function (err, pkg) {
        delete pkg.main;
        var name_js = pkg.name + '.js';
        var name_js_file = node_path.join(dir, name_js);
        fs.write(name_js_file, '');
        var cortex_json = node_path.join(dir, 'cortex.json');
        fs.write(cortex_json, JSON.stringify(pkg, null, 2));

        function cb () {
          counter --;
          if (!counter) {
            done();
          }
        }

        var counter = 2;
        helper.enhanced(dir, function (err, pkg) {
          expect(err).to.equal(null);
          expect(pkg.main).to.equal('./' + name_js);
          cb();
        });

        helper.extra(dir, function (err, pkg) {
          expect(err).to.equal(null);
          expect(pkg.main).not.to.equal('./' + name_js);
          cb();
        });
      });
    });
  });
});


describe("#16", function(){
  it("check if there is an entry named <name>.js", function(done){
    var p = packages('simplest');
    p.copy(function (err, dir) {
      var cortex_json = node_path.join(dir, 'cortex.json');
      var json = fs.readJSON(cortex_json);
      json.entries = ['simplest.js'];
      delete json.main;
      var index = node_path.join(dir, 'index.js');
      fs.remove(index);
      fs.write(cortex_json, JSON.stringify(json, null, 2));

      var name_js = node_path.join(dir, 'simplest.js');
      fs.write(name_js, '');
      
      function cb () {
        counter --;
        if (!counter) {
          done();
        }
      }

      var counter = 2;
      helper.enhanced(dir, function (err, pkg) {
        expect(err).not.to.equal(null);
        expect(err.code).to.equal('CORTEX_MAIN_CONFLICT');
        cb();
      });

      helper.extra(dir, function (err, pkg) {
        expect(err).to.equal(null);
        cb();
      });
    });
  });
});


describe("#15", function(){
  it("ban to fallback to .node file", function(done){
    var p = packages('simplest');
    p.copy(function (err, dir) {
      var cortex_json = node_path.join(dir, 'cortex.json');
      var json = fs.readJSON(cortex_json);
      json.main = 'index'
      fs.write(cortex_json, JSON.stringify(json, null, 2));

      var index = node_path.join(dir, 'index.js');
      fs.remove(index);
      
      var node = node_path.join(dir, 'index.node');
      fs.write(node, '');

      function cb () {
        counter --;
        if (!counter) {
          done();
        }
      }

      var counter = 2;
      helper.enhanced(dir, function (err, pkg) {
        expect(err).not.to.equal(null);
        expect(err.code).to.equal('CORTEX_MAIN_NOT_FOUND');
        cb();
      });

      helper.extra(dir, function (err, pkg) {
        expect(err).to.equal(null);
        cb();
      });
    });
  });
});


describe("#17", function(){
  it("should delete relative origin", function(done){
    var p = packages('simplest');
    p.copy(function (err, dir) {
      var cortex_json = node_path.join(dir, 'cortex.json');
      var json = fs.readJSON(cortex_json);
      json['as'] = {
        './abc': './abc.js'
      };
      fs.write(cortex_json, JSON.stringify(json, null, 2));
      
      helper.enhanced(dir, function (err, pkg) {
        expect(err).to.equal(null);
        expect('./abc' in pkg['as']).to.equal(false);
        done();
      });
    });
  });

  it("should detect the alias which is not found", function(done){
    var p = packages('simplest');
    p.copy(function (err, dir) {
      var cortex_json = node_path.join(dir, 'cortex.json');
      var json = fs.readJSON(cortex_json);
      json['as'] = {
        'abc': './abc.js'
      };
      fs.write(cortex_json, JSON.stringify(json, null, 2));
      
      helper.enhanced(dir, function (err, pkg) {
        expect(err).not.to.equal(null);
        expect(err.code).to.equal('AS_NOT_FOUND');
        done();
      });
    });
  });

  it("should resolve alias", function(done){
    var p = packages('simplest');
    p.copy(function (err, dir) {
      var cortex_json = node_path.join(dir, 'cortex.json');
      var json = fs.readJSON(cortex_json);
      json['as'] = {
        'abc': './abc'
      };
      fs.write(cortex_json, JSON.stringify(json, null, 2));
      var abc = node_path.join(dir, 'abc.js');
      fs.write(abc, '');
      helper.enhanced(dir, function (err, pkg) {
        expect(err).to.equal(null);
        expect(pkg['as']['abc']).to.equal('./abc.js');
        done();
      });
    });
  });
});


describe("#22", function(){
  it("normalize entries", function(done){
    var p = packages('simplest');
    p.copy(function (err, dir) {
      var cortex_json = node_path.join(dir, 'cortex.json');
      var json = fs.readJSON(cortex_json);
      json.entries = ['abc.js'];
      delete json.main;
      var index = node_path.join(dir, 'index.js');
      fs.remove(index);
      fs.write(cortex_json, JSON.stringify(json, null, 2));

      var name_js = node_path.join(dir, 'abc.js');
      fs.write(name_js, '');

      function cb () {
        counter --;
        if (!counter) {
          done();
        }
      }

      var counter = 2;
      helper.enhanced(dir, function (err, pkg) {
        expect(err).to.equal(null);
        expect(pkg.entries).to.deep.equal([
          './abc.js'
        ]);
        cb();
      });

      helper.extra(dir, function (err, pkg) {
        expect(err).to.equal(null);
        expect(pkg.entries).not.to.deep.equal([
          './abc.js'
        ]);
        cb();
      });
    });
  });
});


describe("#24", function(){
  it("should not cache the result", function(done){
    var p = packages('simplest');
    p.copy(function (err, dir) {
      expect(err).to.equal(null);
      helper.enhanced(dir, function (err, origin_pkg) {
        expect(err).to.equal(null);
        // Then, change the file
        var cortex_json = node_path.join(dir, 'cortex.json');
        var json = fs.readJSON(cortex_json);
        json.name = 'blah-blah';
        fs.write(cortex_json, JSON.stringify(json, null, 2));

        helper.enhanced(dir, function (err, pkg) {
          expect(err).to.equal(null);
          expect(pkg.name).to.equal('blah-blah');
          done();
        });
      });
    });
  });
});


describe("#28: 3.5.0, file", function(){
  ['read', 'enhanced', 'extra'].forEach(function (type) {
    it(type + "(): if not found", function(done){
      temp.dir(function (err, path) {
        expect(err).to.equal(null);
        helper[type](path, function (err, pkg, file) {
          expect(!!file).to.equal(false);
          done();
        });
      });
    });

    it(type + "(): cortex.json", function(done){
      temp.dir(function (err, path) {
        expect(err).to.equal(null);
        var f = node_path.join(path, 'cortex.json');
        fs.write(f, '');
        helper[type](path, function (err, pkg, file) {
          expect(file).to.equal(f);
          done();
        });
      });
    });

    it(type + "(): package.json", function(done){
      temp.dir(function (err, path) {
        expect(err).to.equal(null);
        var f = node_path.join(path, 'package.json');
        fs.write(f, '');
        helper[type](path, function (err, pkg, file) {
          expect(file).to.equal(f);
          done();
        });
      });
    });

    it(type + "(): both package.json and cortex.json", function(done){
      temp.dir(function (err, path) {
        expect(err).to.equal(null);
        var f = node_path.join(path, 'cortex.json');
        var p = node_path.join(path, 'package.json');
        fs.write(f, '');
        fs.write(p, '');
        helper[type](path, function (err, pkg, file) {
          expect(file).to.equal(f);
          done();
        });
      });
    });
  });
});
