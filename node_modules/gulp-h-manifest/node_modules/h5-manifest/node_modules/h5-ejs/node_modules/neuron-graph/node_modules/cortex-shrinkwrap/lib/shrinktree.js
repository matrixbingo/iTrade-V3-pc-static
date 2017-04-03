var path = require('path');
var fs = require('fs');
var semver = require('semver');
var async = require('async');
var depTravel = require('cortex-deps-traveller');

var Visitor = depTravel.Visitor;


module.exports = function(name, from, built_root, options, callback) {
  var pkg;
  if (arguments.length <= 4 && typeof name != 'string') {
    pkg = name;
    callback = options;
    options = built_root;
    built_root = from;
    from = undefined;
  }

  if (typeof options == 'function') {
    callback = options;
    options = undefined;
  }

  options = options || {};


  if (!built_root)
    return callback(new Error("Must provide built_root"));

  var merge = !! options.merge;
  delete options.merge;

  var traveller = depTravel(built_root, options);
  var trees = {};

  async.waterfall([

    function(cb) {
      if (pkg) return cb(null, pkg, null);
      process.nextTick(function() {
        traveller.resolveRange(name, from, function(err, version) {
          var pkgDir = path.join(built_root, name, version);
          var swFile = path.join(pkgDir, 'cortex-shrinkwrap.json');
          fs.exists(swFile, function(exists) {
            if (exists) {
              fs.readFile(swFile, 'utf8', function(err, content) {
                if (err) return cb(err);
                try {
                  var json = JSON.parse(content);
                  json.version = json.version || version;
                  delete json.engines;
                  delete json.name;
                  if (from) json.from = name + '@' + from;
                  return cb(null, null, json);
                } catch (e) {
                  return cb(e);
                }
              });
            } else {
              traveller.resolvePackage(name, from, function(err, pkg) {
                return cb(err, pkg, null);
              });
            }
          });
        });
      });
    },
    function(pkg, json, cb) {
      if (json) {
        return cb(null, json);
      }

      traveller.visit(pkg, {
        enter: function(node, parent, circular, ref) {
          var ret;
          var key = node.pkg.name + '@' + node.pkg.version + node.from;

          /* jshint eqnull:true */
          if (parent != null) { // not root
            var pkgDir = path.join(this.built_root, node.pkg.name, node.pkg.version);
            var swFile = path.join(pkgDir, 'cortex-shrinkwrap.json');
            if (fs.existsSync(swFile)) {
              var swObj;
              try {
                swObj = JSON.parse(fs.readFileSync(swFile, 'utf8'));
              } catch (err) {
                throw err;
              }

              if (!trees[key]) {
                trees[key] = {
                  from: node.pkg.name + '@' + node.from,
                  version: node.pkg.version
                };

                if (swObj.dependencies) {
                  trees[key].dependencies = swObj.dependencies;
                }


                if (swObj.asyncDependencies) {
                  if (merge) {
                    tree[key].dependencies = (tree[key].dependencies || []).concat(swObj.asyncDependencies);
                  } else
                    trees[key].asyncDependencies = swObj.asyncDependencies;
                }
              }

              ret = Visitor.SKIP;
            }
          }

          if (!trees[key]) {
            trees[key] = {
              from: node.pkg.name + '@' + node.from,
              version: node.pkg.version
            };
          }

          var n = trees[key];

          if (circular && ref) {
            n = {
              from: node.pkg.name + '@' + node.from,
              version: node.pkg.version
            };
          }

          if (parent) {
            var pkey = parent.pkg.name + '@' + parent.pkg.version + parent.from;
            if (!trees[pkey]) {
              trees[pkey] = {
                from: parent.pkg.name + '@' + parent.from,
                version: parent.pkg.version
              };
            }

            var p = trees[pkey];
            p.dependencies = p.dependencies || {};


            if (merge || parent.pkg.dependencies && parent.pkg.dependencies.hasOwnProperty(node.pkg.name)) {
              p.dependencies[node.pkg.name] = n;
            } else if (parent.pkg.asyncDependencies && parent.pkg.asyncDependencies.hasOwnProperty(node.pkg.name)) {
              p.asyncDependencies = p.asyncDependencies || {};
              p.asyncDependencies[node.pkg.name] = n;
            } else if (parent.pkg.devDependencies && parent.pkg.devDependencies.hasOwnProperty(node.pkg.name)) {
              p.devDependencies = p.devDependencies || {};
              p.devDependencies[node.pkg.name] = n;
            } else {
              p.dependencies[node.pkg.name] = n;
            }
          }

          return ret;
        }
      }, function(err) {
        if (err) return cb(err);
        // root key
        var pkgKey = pkg.name + '@' + pkg.version + undefined;
        // get root json
        var json = trees[pkgKey];
        if (from) json.from = pkg.name + '@' + from;
        cb(null, json);
      });
    }
  ], callback);

  return traveller;
};