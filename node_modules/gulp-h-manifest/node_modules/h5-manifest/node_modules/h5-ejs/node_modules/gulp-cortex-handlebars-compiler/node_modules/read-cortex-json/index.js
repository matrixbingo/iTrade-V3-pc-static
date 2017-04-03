// utility tools for package.json

'use strict';

var fse         = require('fs-extra');
var expand      = require('fs-expand');
var fs          = require('fs');
var node_path   = require('path');
var readPkgJSON = require('read-package-json');
var lang        = require('./lang');
var async       = require('async');
var util        = require('util');

var REGEX_IS_CORTEX = /cortex\.json$/i;


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
          message: 'Both cortex.json and package.json are not found.',
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

  ], callback);
};


// Get the enhanced and cooked json object of package, including
// - readme
// - readmeFilename
// - gitHead
// This method is often used for publishing
// @param {string} cwd The ROOT directory of the current package 
exports.enhanced = function(cwd, callback) {
  var file;
  exports._get_package_file(cwd, function (err, file) {
    if (err) {
      return callback(err);
    }

    exports._enhance_package_file(file, function (err, json) {
      if (err) {
        return callback(err);
      }
      // if read from package.json, there is a field named `cortex`
      if (!exports._is_cortex_json(file)) {
        json = exports._merge_package_json(json);
      }

      async.each([
        '_clean_pkg_css',
        '_clean_pkg_main'
      ], function (task, done) {
        exports[task](cwd, json, done);
      }, function (err) {
        if (err) {
          return callback(err);
        }
        callback(null, json);
      });
    });
  }, true);
};


var SUPPORTED_DIRS = [
  'src',
  'dist'
];

// Validate pkg data for a specified `cwd`
// TODO: split every test as an option
exports.validate = function (cwd, pkg, callback) {
  var name = pkg.name;
  if (name.toLowerCase() !== name) {
    return done({
      code: 'ERROR_UPPER_NAME',
      message: 'package.name should not contain uppercased letters.',
      data: {
        name: name
      }
    });
  }

  var directories = pkg.directories;
  // However we should tell user to stop using `directories.css`,
  // which will removed in the next major.
  if (directories && ('css' in directories)) {
    return callback({
      code: 'NO_SUPPORT_DIR_CSS',
      message: 'Cortex will no longer support `cortex.directories.css` since 4.0.0,\n'
        + 'use `cortex.css` instead.'
    });
  }

  var dirs = directories
    ? Object.keys(directories)
    : [];
  var supported = dirs.every(function (dir) {
    if (~SUPPORTED_DIRS.indexOf(dir)) {
      return true;
    }

    callback({
      code: 'NO_SUPPORT_DIR',
      message: '`directories.' + dir + '` is not supported.',
      data: {
        dir: dir
      }
    });
  });

  if (!supported) {
    return;
  }
  
  var items = dirs.map(function (dir) {
    return {
      path: node_path.join(cwd, dir),
      type: 'isDirectory',
      error: {
        code: 'DIR_NOT_FOUND',
        message: '`directories.' + dir + '` is defined, but not found.',
        data: {
          dir: dir
        }
      }
    };
  });
  var css = pkg.css;
  if (css) {
    css = css.map(function (path) {
      return {
        path: node_path.join(cwd, path),
        type: 'isFile',
        error: {
          code: 'CSS_NOT_FOUND',
          message: '`pkg.css` is defined, but "' + path + '" is not found.',
          data: {
            file: path
          }
        }
      };
    });
    items = items.concat(css);
  }

  // Make sure `directories` and `css` exist
  async.each(items, exports._test_path, callback);
};


exports._test_path = function (obj, done) {
  fs.stat(obj.path, function (err, stat) {
    if (err || !stat[obj.type]()) {
      return done(obj.error);
    }
    done(null);
  });
};


exports._clean_pkg_css = function (cwd, pkg, callback) {
  var css = pkg.css;
  if (!css) {
    // #8
    // standardize `pkg.css` and make sure it is always an array.
    pkg.css = [];
    return callback(null, pkg);
  }

  css = util.isArray(css)
    ? css
    : [css];

  expand(css, {
    cwd: cwd,
    globOnly: true

  }, function (err, files) {
    if (err) {
      return callback(err);
    }

    if (css.length && !files.length) {
      return callback({
        code: 'INVALID_CORTEX_CSS',
        message: '`cortex.css` defined but no css files found.',
        data: {
          css: css
        }
      });
    }

    pkg.css = files;
    callback(null, pkg);
  });
};


exports._clean_pkg_main = function (cwd, pkg, callback) {
  var main = pkg.main;
  var index = 'index.js';
  var name_js = pkg.name + '.js';
  var parsed;

  function cb (parsed) {
    if (parsed) {
      // `require.resolve` is really weird that it will change the path of temp directory.
      // The situation below might happen:
      // ```
      // var a = '/var/folders/xxxxxx'
      // var b = require.resolve(a); // -> /private/var/folders/xxxxx.js
      // ```
      var index = parsed.indexOf(cwd);
      if (~index) {
        // b -> '/var/folders/xxxxx.js'
        parsed = parsed.slice(index);
      }
      // './index.js' -> '/path/to/index.js' -> 'index.js'
      pkg.main = node_path.relative(cwd, parsed);
    } else {
      // `pkg` might has a prototype, so we can't remove a key by deleting them.
      // set it to undefined, `JSON.stringify()` will ignore it.
      pkg.main = undefined;
    }
    callback(null, pkg);
  }

  if (main) {
    parsed = exports._test_file(cwd, main);
    if (!parsed) {
      return callback({
        code: 'MAIN_NOT_FOUND',
        message: '`cortex.main` is defined but "' + main + '" not found.',
        data: {
          main: main
        }
      });
    }
    return cb(parsed);
  }

  parsed = exports._test_file(cwd, index) 
    // fallback to <name>.js
    || exports._test_file(cwd, name_js);
  cb(parsed);
};


exports._test_file = function (cwd, file) {
  var file = node_path.join(cwd, file);
  try {
    file = require.resolve(file);
  } catch(e) {
    return null;
  }
  return file;
};


// We should not read these node.js configurations below
// for cortex
exports._filter_package_fields = function(json) {
  [
    'dependencies', 
    'asyncDependencies', 
    'devDependencies', 
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
  fs.writeFile(file, JSON.stringify(json, null, 2), function(err) {
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
  fse.readJson(file, function (err, pkg) {
    if (err) {
      return callback({
        code: 'ERROR_READ_JSON',
        message: 'Error reading "' + file + '": \n' + e.stack,
        data: {
          error: e
        }
      });
    }

    callback(null, pkg);
  });
};


exports._enhance_package_file = function(file, callback) {
  readPkgJSON(file, callback);
};


// Merge the fields of package.json into the field cortex
// @param {boolean} use_inherits 
exports._merge_package_json = function(pkg, use_inherits) {
  var cortex;

  if (use_inherits) {
    var F = function() {};
    F.prototype = pkg;

    var cortex = new F;
    lang.mix(cortex, pkg.cortex || {});
    delete pkg.cortex;

    exports._filter_package_fields(cortex);

  } else {
    cortex = pkg.cortex || {};
    exports._filter_package_fields(cortex);

    lang.mix(cortex, pkg, false);
    delete cortex.cortex;
  }

  return cortex;
};

// Get the root path of the project
exports.package_root = function(cwd, callback) {
  if (cwd === '/') {
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