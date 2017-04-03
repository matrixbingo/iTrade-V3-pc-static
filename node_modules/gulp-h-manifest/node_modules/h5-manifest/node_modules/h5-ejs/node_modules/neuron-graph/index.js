'use strict';

module.exports = graph;

var jf = require('jsonfile');
var path = require('path');
var fs = require('fs');
var shrinkwrap = require('cortex-shrinkwrap');
var gen_graph = require('gen-graph');

function graph(pkg, options, callback ) {
  options || (options = {});
  (options.dependencyKeys) || (options.dependencyKeys = ['dependencies', 'asyncDependencies']);

  read_shrinkwrap(pkg, options, function (err, shrinkwrap) {
    if (err) {
      return callback(err);
    }

    // update the version of shrinkwrap
    shrinkwrap.version = pkg.version;

    var keys = options.dependencyKeys;
    var rs = gen_graph(shrinkwrap, {
      edge_keys : keys
    });

    callback(null, rs, shrinkwrap);
  });
}


function read_shrinkwrap (pkg, options, callback) {
  if (options.shrinkwrap) {
    return callback(null, options.shrinkwrap);
  }

  var shrinkwrap_json = path.join(options.cwd, 'cortex-shrinkwrap.json');

  var keys = options.dependencyKeys;
  var shrink_options = {
    stableOnly: options.stable_only == false ? false : true,
    async: ~keys.indexOf('asyncDependencies'),
    dev: ~keys.indexOf('devDependencies')
  };

  if (options.ignore_shrink_file) {
    return shrinkwrap(pkg, options.built_root, shrink_options, callback);
  }

  fs.exists(shrinkwrap_json, function(exists) {
    if (exists) {
      return jf.readFile(shrinkwrap_json, callback);
    }

    shrinkwrap(pkg, options.built_root, shrink_options, callback);
  });
};
