(function(){
function mix(a,b){for(var k in b){a[k]=b[k];}return a;}
var _0 = "mix@1.0.1/index.js";
var asyncDepsToMix = {};
var globalMap = asyncDepsToMix;
define(_0, [], function(require, exports, module, __filename, __dirname) {
'use strict';

module.exports = mix;


// copy all properties in the supplier to the receiver
// @param r {Object} receiver
// @param s {Object} supplier
// @param or {boolean=} whether override the existing property in the receiver
// @param cl {(Array.<string>)=} copy list, an array of selected properties
function mix (r, s, or, cl) {
  if (!s || !r) {
    return r;
  }

  var i = 0,
    c, len;

  or = or || arguments.length === 2;

  if (cl && (len = cl.length)) {
    for (; i < len; i++) {
      c = cl[i];
      if ((c in s) && (or || !(c in r))) {
        r[c] = s[c];
      }
    }
  } else {
    for (c in s) {
      if (or || !(c in r)) {
        r[c] = s[c];
      }
    }
  }
  return r;
};

}, {
    main:true,
    map:globalMap
});
})();