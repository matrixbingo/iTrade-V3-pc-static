'use strict';

module.exports = shrinked;

var jf = require('jsonfile');

// @param {path} file
// @param {Object} options
//   - dependencyKeys {Array}
// @param {function(err, tree)} callback
function shrinked (file, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  jf.readFile(file, function (err, json) {
    if (err) {
      return callback(err);
    }

    var tree = shrinked.parse(json, options);
    return callback(null, tree);
  });
}

shrinked._walk = function (node, keys, host) {
  var name = node.name;
  var version = node.version;

  var pkg = host[name] || (host[name] = {});

  if (pkg[version]) {
    return;
  }

  var current = pkg[version] = {};
  keys.forEach(function (key) {
    var deps = node[key] || {};
    var parsed_deps = current[key] = {};

    var dep_name;
    var dep_info;
    var dep_range;
    var is_empty = true;

    for(dep_name in deps) {
      is_empty = false;

      dep_info = deps[dep_name];
      
      // At the toplevel of shrinkwrap.json,
      // there is a `name` field but not for sub level of the object
      // so, we add it.
      dep_info.name = dep_name;

      // `dep_info` must be an object
      if (!shrinked._invalid(dep_info)) {
        continue;
      }

      dep_range = shrinked._parseFrom(dep_info.from).range;
      parsed_deps[dep_name] = {};
      parsed_deps[dep_name][dep_range] = dep_info.version;
      shrinked._walk(dep_info, keys, host);
    }

    if (is_empty) {
      delete current[key];
    }
  });
};


// 'a@~0.2.3'
// -> 
// {
//   name: 'a',
//   range: '~0.2.3'
// }
shrinked._parseFrom = function(pkg) {
  var split = pkg.split('@');

  return {
    name: split[0],
    range: split[1]
  };
};


// @param {Object} node
// @returns if a node is invalid
shrinked._invalid = function (node) {
  if (!node || Object(node) !== node) {
    return false;
  }

  return [node.name, node.version, node.from].every(function (str) {
    return str && typeof str === 'string';
  });
};


shrinked.parse = function (json, options) {
  var tree = {};
  options || (options = {});
  var keys = options.dependencyKeys || ['dependencies'];
  shrinked._walk(json, keys, tree);
  return tree;
};
