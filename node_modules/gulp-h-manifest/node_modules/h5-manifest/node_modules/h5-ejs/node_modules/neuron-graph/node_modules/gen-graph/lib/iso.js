var EDGE_KEYS = require('./common').EDGE_KEYS;

module.exports = isIsomorphism;

function isIsomorphism(a, b, path) {
  path = path || [];
  var aid = a.name + '@' + a.version;
  var bid = b.name + '@' + b.version;
  if (aid == bid) {

    if (~path.indexOf(aid)) {
      return true;
    }

    path.push(aid);
    var compare = true;
    EDGE_KEYS.forEach(function(depName) {
      var da = a[depName],
        db = b[depName];

      if (!compare)
        return;

      if (da === db) {
        return;
      }


      if (da && db) {
        var das = Object.keys(da).sort(),
          dbs = Object.keys(db).sort();

        if (das.length != dbs.length)
          compare = false;
        else {
          for (var i = 0, len = das.length; i < len && compare; ++i) {
            var aname = das[i],
              bname = dbs[i];
            if (aname != bname)
              compare = false;
            else {
              var ma = da[aname],
                mb = db[bname];
              if (ma.version != mb.version) {
                compare = false;
              } else {
                compare = isIsomorphism(ma, mb, path);
              }
            }
          }
        }
      } else {
        compare = false;
      }
    });

    path.pop();

    return compare;
  }

  return false;
}

// isIsomorphism.cache = new Multimap();