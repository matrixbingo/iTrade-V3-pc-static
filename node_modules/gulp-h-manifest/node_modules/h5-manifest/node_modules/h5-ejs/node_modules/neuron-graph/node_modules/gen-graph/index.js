"use strict";
var Multimap = require('multimap');

var EDGE_KEYS = require('./lib/common').EDGE_KEYS;
var isIsomorphism = require('./lib/iso');

module.exports = function(trees, options) {
  gid.__id__ = 0;

  var map = new Multimap();
  var rs = {
    _: {}
  };

  options = options || {};
  var compress = options.compress !== false; // default true
  var edgeKeys = options.edge_keys || EDGE_KEYS;

  if (!Array.isArray(trees))
    trees = [trees];

  trees.forEach(function(root) {
    travel(root.name, root);
    rs._[root.name + '@' + root.version] = gid(root);
  });


  return rs;

  function travel(name, root, path) {
    path = path || [];

    var id = name + '@' + root.version;


    var cycle = false;
    for (var len = path.length, i = len - 1; i >= 0; --i) {
      if (path[i].id == id) {
        root.__id = path[i].oid;
        cycle = true;
        break;
      }
    }

    if (cycle)
      return;

    var nodes = map.get(id),
      found = false;

    (nodes || []).forEach(function(node) {
        if (!found) {
          if (isIsomorphism(root, node)) {
            root.__id = gid(node);
            found = true;
          }
        }
      });

    if (!found) {
      map.set(id, root);
    }

    var oid = gid(root);

    if (rs.hasOwnProperty(oid)) {
      // no need to handle isomophismes of an graph
      return;
    }


    path.push({
      id: id,
      oid: oid
    });

    edgeKeys.forEach(function(depName) {
      var deps = root[depName];
      if (deps) {
        Object.keys(deps).forEach(function(name) {
          travel(name, deps[name], path);
        });
      }
    });


    // post order travel
    var obj = rs[oid] = [compress ? root.version: id];
    var dep;

    edgeKeys.forEach(function(depName) {
      var deps = root[depName];
      if (deps) {
        dep = dep || {};
        Object.keys(deps).forEach(function(name) {
          var node = deps[name];
          dep[node.from] = gid(node);
        });
      }
    });

    if(dep)
      obj.push(dep);

    path.pop();
  }


  function gid(object) {
    if (object.hasOwnProperty('__id')) {
      return object.__id;
    }

    object.__id = gid.__id__++;

    return object.__id;
  }


};
