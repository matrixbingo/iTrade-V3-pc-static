(function(){
function mix(a,b){for(var k in b){a[k]=b[k];}return a;}
var _0 = "hippo@1.2.20-beta/lib/hippo3.js";
var asyncDepsToMix = {};
var globalMap = asyncDepsToMix;
define(_0, [], function(require, exports, module, __filename, __dirname) {
;(function() {

var win = window;
// `_hip` might have already been declared
var Hippo = win._hip;

var doc = win.document;
var loc = doc.location;
var ref = doc.referrer;
var href = loc.href;
var screen = win.screen;
var element_test = doc.createElement('div');
var ADD_EVENT_LISTENER = 'addEventListener';
var REMOVE_EVENT_LISTENER = 'removeEventListener';

var addEvent = element_test[ADD_EVENT_LISTENER] ?
    function(el, type, fn, useCapture) {
      el[ADD_EVENT_LISTENER](type, fn, !! useCapture);
  } :

  function(el, type, fn) {
    el.attachEvent('on' + type, fn);
  };


if (!Hippo) {
  Hippo = win._hip = [];
}

// CommonJS
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Hippo;
}


// Prevent duplicate loading of hippo
if (Hippo.loaded) {
  return;
}
Hippo.loaded = true;


// Take a look at:
// ```js
// Hippo.i = new Image();
// Hippo.i.src = url;
// ```
// Creating a new image will connect to another thread.
// If another hippo request comes in, the previous one might be destroyed by GC.
// So we need to queue the requests.
var queue = [];
Hippo.queue = queue;
var timers = {};

var cachedNativeRequestId;
var gettingRequestId;
var gettingRequestIdCallbacks = [];

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

function log(msg){
  window.console && console.log(msg);
}

function setCookie(cname, cvalue, exdays, domain, path){
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var kv = cname + "=" + cvalue
  var expires = "expires=" + d.toUTCString();
  var path = "path=" + path;
  var domain = "domain=" + domain;
  document.cookie = [kv, expires, domain, path].join(";");
}

function getHCV(){
  var hcv = document.cookie.match(/_hc.v=([^;]+)/);
  if(!hcv){
    return null;
  }
  return hcv[1];
}

function generateHCV(){
  return guid() + '.' + Math.round(+new Date()/ 1000);
}

function setHCV(){
  var segments = doc.domain.split(".");
  while(segments.length > 2){
      segments.shift();
  }
  var domain = "." + segments.join(".");
  var hcv = generateHCV();
  log('hippo:setHCV', hcv);
  setCookie("_hc.v", hcv, 365, domain, "/");
}

if(!getHCV()){
  setHCV();
}

// new method for getting requestid
var regexVer = /dp\/com\.dianping\.[\w\.]+\/([\d\.]+)/i;
var getAppVersion = function (ua) {
  var version;
  var regexMAPI = /MApi/;
  var match  = ua.match(regexVer);
  if (match) {
    version = match[1];
  }
  return version;
};
var getOSName = function (ua) {
  var regexAndroid = /android/i;
  var regexIos = /ipad|iphone/i;
  if (regexAndroid.test(ua)) {
    return 'android';
  } else if (regexIos.test(ua)) {
    return 'ios';
  }
};
var Semver = {
  eq: function(a, b) {
    return a === b;
  },
  gt: function(a, b) {
    var splitedA = a ? a.split(".") : [];
    var splitedB = b ? b.split(".") : [];
    [0,1,2].forEach(function(i) {
      splitedA[i] = splitedA[i] || 0;
      splitedB[i] = splitedB[i] || 0;
    });
    if (+splitedA[0] !== +splitedB[0]) {
      return +splitedA[0] > +splitedB[0];
    } else {
      if (+splitedA[1] !== +splitedB[1]) {
        return +splitedA[1] > +splitedB[1];
      } else {
        return +splitedA[2] > +(splitedB[2] || 0);
      }
    }
  },
  lt: function(a, b) {
    return !this.gte(a, b);
  },
  gte: function(a, b) {
    return this.eq(a, b) || this.gt(a, b);
  },
  lte: function(a, b) {
    return this.eq(a, b) || this.lt(a, b);
  }
}

var UA = win.navigator.userAgent;
var mobileType = getOSName(UA),
    appVersion = getAppVersion(UA);
var isSuitableVersion;
if (appVersion && Semver.gte(appVersion, '8.1.0')) {
  isSuitableVersion = true;
}

function _insureRequestId(callback){
  if(cachedNativeRequestId){
    return callback();
  }else if(gettingRequestId){
    gettingRequestIdCallbacks.push(callback);
    return;
  }

  gettingRequestId = true;
  gettingRequestIdCallbacks.push(callback);
  var _originDequeue = win.DPApp && win.DPApp.dequeue;
  var tinyDPApp = {
    callback: function(callbackId, retValue){
      log('hippo:callback', callbackId, retValue);
      var callback = win[this._generateCallbackName(callbackId)] ;
      callback && callback.call(this, retValue);
    },
    _generateCallbackName: function(callbackId){
      return "DPApp_callback_" + callbackId;
    },
    _generateCallbackId: function(){
      var rand = Math.floor(Math.random() * 1000);
      var timestamp = +new Date();
      return +(timestamp + "" + rand);
    },
    dequeue: function(){
      _originDequeue && _originDequeue();
    },
    getRequestId: function(opts){
      var success = opts.success;
      var callbackId = this._generateCallbackId();
      win[this._generateCallbackName(callbackId)] = function(result){
        success && success(result);
      }

      log('hippo:callbackId ' + callbackId);
      var src = 'js://_?method=getRequestId&args=%7B%7D&callbackId=' + callbackId;
      var ifr = document.createElement('iframe');
      ifr.style.display = 'none';
      function removeIframe(){
        ifr.onload = ifr.onerror = null;
        ifr.parentNode && ifr.parentNode.removeChild(ifr);
      }
      /**
       * remove iframe after loaded
       */
      ifr.onload = ifr.onerror = removeIframe;
      setTimeout(removeIframe,5000);
      ifr.src = src;
      document.body.appendChild(ifr);
    },
    getRequestIdNew: function(opts){
      var success = opts.success;
      var callbackId = this._generateCallbackId();
      win[this._generateCallbackName(callbackId)] = function(result){
        success && success(result);
      }

      log('hippo:callbackId ' + callbackId);
      var src = 'js://_?method=getRequestId&args=%7B%7D&callbackId=' + callbackId;
      win.prompt(src);
    }
  }
  if(!win.DPApp){
    win.DPApp = tinyDPApp;
  }else if(!win.DPApp.getRequestId || !win.DPApp.getRequestIdNew){
    for(var key in tinyDPApp){
      win.DPApp[key] = tinyDPApp[key];
    }
  }

  bind_domready(function(){
    if (isSuitableVersion && (mobileType == 'ios') && win._DPApp && win._DPApp.requestId) {
      custom_const['reqid'] = cachedNativeRequestId = win._DPApp.requestId;
      log('reqid:' + win._DPApp.requestId);
      gettingRequestIdCallbacks.forEach(function(callback){
        callback();
      });
      gettingRequestIdCallbacks = [];
      gettingRequestId = false;
      cachedNativeRequestId = null;
    } else if (isSuitableVersion && (mobileType == 'android')) {
      DPApp.getRequestIdNew({
        success: function(result){
          custom_const['reqid'] = cachedNativeRequestId = result.requestId;
          log('reqid:' + result.requestId);
          gettingRequestIdCallbacks.forEach(function(callback){
            callback();
          });
          gettingRequestIdCallbacks = [];
          gettingRequestId = false;
          cachedNativeRequestId = null;
        }
      });
    } else {
      DPApp.getRequestId({
        success: function(result){
          custom_const['reqid'] = cachedNativeRequestId = result.requestId;
          log('reqid:' + result.requestId);
          gettingRequestIdCallbacks.forEach(function(callback){
            callback();
          });
          gettingRequestIdCallbacks = [];
          gettingRequestId = false;
        }
      });
    }
  });
}

// send a hippo request
// @param {string} key
// @param {Array.<string>} value
// @param {object} data
function send(key, value, data, ajax) {

  // 在native端通过jsbridge获取RequestId以串连日志
  if(/com\.dianping/.test(navigator.userAgent) && !cachedNativeRequestId){
    custom_const['appname'] = 'dianping';
    _insureRequestId(function(){
      send(key, value, data, ajax);
    });
    return;
  }

  var src = URL_BASE + generateQuery(key, value, data);
  if(ajax){
    xhr(src);
    return;
  }
  var timer = setTimeout(function () {
    // Old browsers suck, never use `delete`
    timers[timer] = false;
    var image = new Image(1, 1);
    queue.push(image);
    registerClean(image);
    image.src = src;
    src = null;
  }, 0);

  timers[timer] = src;
}

function registerClean (image) {
  ['onload', 'onerror', 'onabort'].forEach(function (event) {
    image[event] = function () {
      try {
        image.onload = image.onerror = image.onabort = null;
      } catch(e) {}

      // If there is an image aborted, then try to send xhr.
      // Actually, it is once in a blue moon.
      if (event === 'onabort') {
        image.src && xhr(image.src);
      }

      // if on error, we consider it has been received by server side
      clean(image, queue);
    };
  });
}

function clean (subject, array) {
  var i = 0;
  var len = array.length;
  var item;
  for(; i < len; i ++){
    item = array[i];
    if (item === subject) {
      array.splice(i, 1);
      break;
    }
  }
}

var Xhr = win.ActiveXObject
  // fallback
  ? function() {
    if (win.XMLHttpRequest) {
      try {
          return standardXMLHttpRequest();
      } catch(e) {}
    }
    try {
      return new win.ActiveXObject('Microsoft.XMLHTTP');
    } catch(e) {}
  }
  : standardXMLHttpRequest;

function standardXMLHttpRequest(){
  return new XMLHttpRequest();
}

function xhr (src) {
  var x = Xhr();
  // evt / h5 / meituan domain will send to hls directly
  if(!/^[evt|h5]|meituan/.test(location.host)){
    src = src.replace(HOST, '');
  }
  x.open('GET', src, false);
  // for cookie
  x.withCredentials = true;
  x.send();
}

var unload = false;
// Register both onbeforeunload and onunload to solve the known issue of Opera
win.onbeforeunload = win.onunload = function () {
  if (unload) {
    return;
  }
  unload = true;
  var timer;
  var src;
  for (timer in timers) {
    src = timers[timer];
    if (src) {
      clearTimeout(Number(timer));
      xhr(src);
    }
  }
};


// default params
var _pageId = 0;
var _shopType = 0;
var _cityId = 0;
var _domain = 'www.dianping.com';

// @const
var NOOP = function() {};

var HOST = '//hls.' + (/51ping/.test(doc.domain) ? '51ping' : 'dianping') + '.com';
var URL_BASE = HOST + '/hippo.gif?';
var SCREEN_SIZE_KEY = '__hsr';
var SCREEN_COLOR_DEPTH_KEY = '__hsc';
var LOCATION_HREF_KEY = '__hlh';
var LOCATION_REFERRER_KEY = '__hlr';
var PAGE_TRACK_KEY = '__pv';
var MODULE_TRACK_KEY = '__mv';


////////////////////////////////////////////////////////////////////////////
// lang
////////////////////////////////////////////////////////////////////////////

// method to stringify an object
// optimized for v8
// @param {Object} obj the object to be stringified
// @returns {string}
var stringify = (function() {
  return win.JSON && JSON.stringify || function(obj) {
    var ret = [],
      key,
      value;

    for (key in obj) {
      value = obj[key];

      if (Object(value) !== value) {
        ret.push('"' + key + '":"' + ("" + value).replace(/"/g, '\\"') + '"');
      }
    }

    return '{' + ret.join(',') + '}';
  };
})();

var AP = Array.prototype;
if (!AP.forEach) {
  AP.forEach = function(fn, this_object) {
    for (var i = 0, len = this.length; i < len; i++) {
      if (i in this) {

        // if fn is not callable, it will throw
        fn.call(this_object, this[i], i, this);
      }
    }
  };
}


function toQueryString(obj) {
  var encode = encodeURIComponent,
    key,
    value,
    ret = [];

  for (key in obj) {
    value = obj[key];

    if (Object(value) !== value) {

      // {
      //    key1: undefined,
      //    key2: "a"
      // }
      // -> key1=&key2=a
      ret.push(key + '=' + encode(value || ''));
    }
  }

  return ret.join('&');
};

// @param {boolean=} not_override Whether we should not override
function mix(r, s, not_override) {
  var key;

  if (!s) {
    return;
  }

  for (key in s) {
    if (!not_override || !(key in r)) {
      r[key] = s[key];
    }
  }

  return r;
};

function chk(key, value) {
  return typeof key === 'string' && Object(value) !== value;
};


////////////////////////////////////////////////////////////////////////////
// Hippo methods
////////////////////////////////////////////////////////////////////////////


// 生成hippo专用的query string
// @private
var generateQuery = (function() {

  // 有些内容是单次会话保持不变的，先计算出来
  var h, w, s, c, f,
    presets = {};

  if (s = screen) {
    h = s.height;
    w = s.width;

    if (h && w) {
      presets[SCREEN_SIZE_KEY] = w + 'x' + h;
    }

    if (c = s.colorDepth) {
      presets[SCREEN_COLOR_DEPTH_KEY] = c + 'bit';
    }
  }

  // @param {string} key
  // @param {Array.<mixed>} value
  // @param {Object=} data
  // @param {Object=}
  return function(key, value, data) {
    data = data || {};
    mix(data, custom_const, false);

    var current = {
      '__hlt': _domain,
      '__ppp': _pageId,
      '__had': stringify(data),
      'force': +new Date
    };

    mix(current, presets);

    if (href) {
      current[LOCATION_HREF_KEY] = href;
    }

    if (ref) {
      current[LOCATION_REFERRER_KEY] = ref;
    }

    value.push(_cityId + '|' + _shopType);

    current[key] = value.join('|');

    return toQueryString(current);
  };

})();


////////////////////////////////////////////////////////////////////////////
// legacy
////////////////////////////////////////////////////////////////////////////

// legacy for .ext()
var data_attached = {};

// @param {number} page id of current page
// @param {string=} z base url of site
function document_hippo(pageId, domain) {
  HIPPO_METHODS._setPageId(pageId);
  return document_hippo;
};

mix(document_hippo, {

  // extensive parameters for next hippo request
  // @param {string||Object} name
  // @param {mixed=} value
  ext: function(name, value) {
    var key;

    if (Object(name) === name) {
      for (key in name) {
        document_hippo.ext(key, name[key]);
      }

    } else if (chk(name, value)) {
      data_attached[name] = value;
    }

    return document_hippo;
  },

  // remove data that be setted by ext method
  // @param {string=} name if no name passed in, hippo will remove all relative data
  rxt: function(name) {
    if (typeof name === 'string') {
      delete data_attached[name];

    } else if (!arguments.length) {
      data_attached = {};
    }

    return document_hippo;
  },


  // send a page-view request
  // @param {number} cityId
  // @param {number=} shopType
  pv: function(cityId, shopType) {
    HIPPO_METHODS._setCityId(cityId);
    HIPPO_METHODS._setShopType(shopType);
    HIPPO_METHODS._setPVInitData(data_attached);

    return document_hippo;
  },

  // send a module-view request
  // @param {number} moduleId
  // @param {mixed} value
  mv: function(moduleId, value) {

    if (chk(moduleId, value)) {
      data_attached[moduleId] = value;

      HIPPO_METHODS.mv(data_attached);
    }

    return document_hippo;
  }
});

// for backward compatibility
document.hippo = document_hippo;


////////////////////////////////////////////////////////////////////////////
// new Hippo
////////////////////////////////////////////////////////////////////////////

var auto_pv = true;
var auto_page_timing = true;
var page_timing_version;


var HIPPO_METHODS = {
  _setPageId: function(pageId) {
    _pageId = pageId >>> 0;
  },

  _setCityId: function(cityId) {
    _cityId = cityId >>> 0;
  },

  _setShopType: function(shopType) {
    _shopType = shopType >>> 0;
  },

  _setPVInitData: function(data) {
    // run once
    HIPPO_METHODS._setPVInitData = NOOP;
    setTimeout(function() {
      pv(data);
    }, 0);
  },

  _autoPV: function(auto) {
    auto_pv = auto;
  },

  _autoPageTiming: function(timing) {
    auto_page_timing = timing;
  },

  // DP.data('hippo_perf_version', 'b1') ->
  // _hip.push(['_setPageTimingVer', 'b1'])
  _setPageTimingVer: function(version) {
    page_timing_version = version;
  },

  _setReferrer: function(referrer) {
    ref = referrer;
  },

  _setHref: function(h) {
    href = h;
  },

  _setRequestId: function(id) {
    setCustomConst('reqid', id);
  },

  _setGuid: function(id) {
    setCustomConst('serverguid', id);
  },

  _setCustomConst: setCustomConst,

  mv: function(data, ajax) {
    send(MODULE_TRACK_KEY, ['', ''], data || data_attached, ajax);
    data_attached = {};
  },

  pv: function(data) {
    pv(data);
  }
};


var custom_const = {};

function setCustomConst(key, value) {
  custom_const[key] = value;
}


function pv(data) {
  send(PAGE_TRACK_KEY, [], data || data_attached);
  data_attached = {};
}


Hippo.push = function(command) {
  var action, data, method;

  if (command) {
    action = command.shift();
    method = HIPPO_METHODS[action];

    method && method.apply(null, command);
  }
};

// apply
Hippo.forEach(function(command) {
  Hippo.push(command);
});


// if new hippo(`_hip`) exists, push `'_setPVInitData'` to make sure there is a pv request
auto_pv && Hippo.push(['_setPVInitData']);


Hippo.length = 0;

// if(Math.random() > NET_SPEED_SAMPLE_RATE){
//     return;
// }

// pagetiming

var render_start = win.G_rtop;
var domready_time;

function makeSense(origin, fallback) {
  return origin > 0 ? origin : fallback;
};

function onDomReady() {
  domready_time = +new Date;
};

function onLoad() {
  var version;
  var perf = win.performance;
  var t = perf && perf.timing;
  var r_ready = domready_time - render_start;
  var r_load = +new Date - render_start;
  var data = {
    r_pagetiming: 1,
    r_ready: r_ready,
    r_load: r_load
  };

  if (t) {
    mix(data, {
      r_conn: t.connectEnd - t.connectStart,
      r_recev: t.responseEnd - t.responseStart,
      r_ready: makeSense(t.domInteractive - t.domLoading, r_ready),
      r_wait: t.responseStart - t.requestStart,
      r_load: makeSense(t.loadEventStart - t.domLoading, r_load)
    });
  }

  if ((version = page_timing_version) || (version = win.DP && DP.data && DP.data('hippo_perf_version'))) {
    data['test'] = version;
  }

  HIPPO_METHODS.mv(data);

  removeEvent(win, 'load', onLoad);
};


function bind_domready(fn) {

  // Catch cases where ready() is called after the
  // browser event has already occurred.
  if (doc.readyState === 'complete') {
    return fn();
  }

  var doScroll = doc.documentElement.doScroll;
  var eventType = doScroll ? 'readystatechange' : 'DOMContentLoaded';

  var ready = function() {
    removeEvent(doc, eventType, ready);
    removeEvent(win, 'load', ready);
    fn();
  };

  addEvent(doc, eventType, ready);

  // A fallback to load
  // and make sure that domready event fires before load event registered by user
  addEvent(win, 'load', ready);

  if (doScroll) {
    var poll_scroll = function() {
      try {
        // doScroll technique by Diego Perini http://javascript.nwbox.com/IEContentLoaded/
        doScroll('left');
        ready();
      } catch (ex) {
        setTimeout(poll_scroll, 10);
      }
    };

    var not_framed = false;

    try {
      not_framed = win.frameElement == null;
    } catch (e) {}

    if (not_framed) {
      poll_scroll();
    }
  }
};

var removeEvent = element_test[REMOVE_EVENT_LISTENER] ?
    function(el, type, fn, useCapture) {
      el[REMOVE_EVENT_LISTENER](type, fn, !! useCapture);
  } :

  function(el, type, fn) {
    el.detachEvent('on' + type, fn);
  };


if (auto_page_timing) {
  bind_domready(onDomReady);
  addEvent(win, 'load', onLoad);
}

})();
}, {
    main:true,
    map:globalMap
});
})();