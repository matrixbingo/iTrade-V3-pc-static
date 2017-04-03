// utility tools for package.json

'use strict';

var fse         = require('fs-extra');
var fs          = require('fs');
var node_path   = require('path');
var read        = require('./lib/read');
var async       = require('async');
var cleaner     = require('./lib/cleaner');
var util        = require('util');
var mix         = require('mix2');
var comment_json = require('comment-json');

var REGEX_IS_CORTEX = /cortex\.json$/i;


// Cleans the cortex.json for legacy
exports.clean = function (cwd, json, callback) {
  cleaner.clean(cwd, json, callback);
};


exports._is_cortex_json = function(file) {
  return REGEX_IS_CORTEX.test(file);
};


// Sync method
// @param {path} cwd
// @param {function(err, package_file)} callback
// @param {boolean} strict If true and package is not found, an error will be thrown.
exports._get_package_file = function(cwd, callback, strict) {
  var cortex_json = node_path.join(cwd, 'cortex.json');
  fs.exists(cortex_json, function (exists) {
    if (exists) {
      return callback(null, cortex_json);
    }

    var package_json = node_path.join(cwd, 'package.json');
    fs.exists(package_json, function (exists) {
      if (exists) {
        return callback(null, package_json);
      }

      if (strict) {
        return callback({
          code: 'PKG_NOT_FOUND',
          message: 'Both cortex.json and package.json are not found around "' + cwd + '"',
          data: {
            cwd: cwd
          }
        });
      }

      // default to `cortex_json`
      callback(null, cortex_json);
    });
  });
};


// Get the original json object about cortex, or the cortex field of package.json.
// This method is often used for altering package.json file
exports.read = function(cwd, callback, use_inherits) {
  var file;
  async.waterfall([
    function(done) {
      exports._get_package_file(cwd, done, true);
    },
    function(f, done) {
      file = f;
      exports._read_json(f, done);
    },
    function(json, done) {
      if (!exports._is_cortex_json(file)) {
        json = exports._merge_package_json(json, use_inherits);
      }
      done(null, json);
    }

  ], function (err, json) {
    callback(err, json, file);
  });
};


exports.extra = function (cwd, callback) {
  exports._extra(cwd, callback);
};


// This method will also clean the data
// @param {string} cwd The ROOT directory of the current package 
exports.enhanced = function(cwd, callback) {
  exports._extra(cwd, callback, true);
};


// Get the cooked json object of package, including
// - readme
// - readmeFilename
// - gitHead
exports._extra = function (cwd, callback, clean) {
  var file;
  exports._get_package_file(cwd, function (err, file) {
    if (err) {
      return callback(err);
    }

    function cb (err, pkg) {
      if (err) {
        return callback({
          code: err.code,
          message: err.message + '\nFile: "' + file + '"',
          stack: err.stack,
          data: err.data
        }, null, file);
      }
      callback(null, pkg, file);
    }

    exports._enhance_package_file(file, function (err, json) {
      if (err) {
        return cb(err);
      }
      // if read from package.json, there is a field named `cortex`
      if (!exports._is_cortex_json(file)) {
        json = exports._merge_package_json(json);
      }

      if (clean) {
        cleaner.clean(cwd, json, cb);
      } else {
        cb(null, json);
      }
    });
  }, true);
};


// We should not read these node.js configurations below
// for cortex
exports._filter_package_fields = function(json) {
  [
    'dependencies', 
    'asyncDependencies', 
    'devDependencies',
    'directories',
    'engines',
    'scripts'
  ].forEach(function(key) {
    if (!json.hasOwnProperty(key)) {
      json[key] = {};
    }
  });
};


exports.save = function(cwd, json, callback) {
  exports._get_package_file(cwd, function(err, file) {
    if (err) {
      return callback(err);
    }

    if (exports._is_cortex_json(file)) {
      exports._save_to_file(file, json, callback);

    } else {
      exports._read_json(file, function(err, pkg) {
        if (err) {
          return callback(err);
        }

        pkg.cortex = json;

        exports._save_to_file(file, pkg, callback);
      });
    }
  });
};


exports._save_to_file = function(file, json, callback) {
  fs.writeFile(file, comment_json.stringify(json, null, 2), function(err) {
    callback(err && {
      code: 'ERROR_SAVE_PKG',
      message: 'fail to save package to "' + file + '", error: ' + err.stack,
      data: {
        error: err,
        file: file
      }
    });
  });
};


exports._read_json = function(file, callback) {
  function cb (err, pkg) {
    if (err) {
      return callback({
        code: 'ERROR_READ_JSON',
        message: 'Error reading "' + file + '": \n' + err.stack,
        data: {
          error: err
        }
      });
    }

    callback(null, pkg);
  }

  fs.readFile(file, function (err, content) {
    if (err) {
      return cb(err);
    }

    var pkg;
    try {
      pkg = comment_json.parse(content.toString());
    } catch(e) {
      return cb(e);
    }

    cb(null, pkg);
  });
};


exports._enhance_package_file = function(file, callback) {
  read(file, callback);
};


// Merge the fields of package.json into the field cortex
// @param {boolean} use_inherits 
exports._merge_package_json = function(pkg, use_inherits) {
  var cortex;

  if (use_inherits) {
    var F = function() {};
    F.prototype = pkg;

    var cortex = new F;
    mix(cortex, pkg.cortex || {});
    delete pkg.cortex;

    exports._filter_package_fields(cortex);

  } else {
    cortex = pkg.cortex || {};
    exports._filter_package_fields(cortex);

    mix(cortex, pkg, false);
    delete cortex.cortex;
  }

  return cortex;
};


var SYS_ROOT = node_path
  // in windows, sys_root will be 'c:\\'
  .resolve('/')
  // It is weird that sometime the disk name of windows is lowercase, sometime uppercase
  .toLowerCase();

// Get the root path of the project
exports.package_root = function(cwd, callback) {
  if (!cwd || cwd.toLowerCase() === SYS_ROOT) {
    return callback(null);
  }

  fs.exists(node_path.join(cwd, 'cortex.json'), function (exists) {
    if (exists) {
      return callback(cwd);
    }

    fs.exists(node_path.join(cwd, 'package.json'), function (exists) {
      if (exists) {
        return callback(cwd);
      }

      cwd = node_path.dirname(cwd);
      return exports.package_root(cwd, callback);
    });
  });
};


// Get the cached document of a specific package,
// which will be saved by the last `cortex install` or `cortex publish`
// @param {name} name
// @param {path} cache_root
// @param {fuction(err, json)} callback
exports.cached_document = function(name, cache_root, callback) {
  var document_file = node_path.join(cache_root, name, 'document.cache');

  fs.exists(document_file, function (exists) {
    if (!exists) {
      return callback(null, {});
    }

    fs.readFile(document_file, function (err, content) {
      // fail silently
      if (err) {
        return callback(null, {});
      }

      var json;
      try {
        json = JSON.parse(content);
      } catch (e) {
        // Removes bad data
        fse.remove(document_file, function(){});
      }

      callback(null, json || {});
    });
  });
};
