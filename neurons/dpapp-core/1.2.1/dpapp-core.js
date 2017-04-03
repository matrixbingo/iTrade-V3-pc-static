(function(){
function mix(a,b){for(var k in b){a[k]=b[k];}return a;}
var _0 = "promise@^6.1.0";
var _1 = "dpapp-core@1.2.1/lib/core.js";
var _2 = "dpapp-core@1.2.1/lib/native-core.js";
var _3 = "dpapp-core@1.2.1/lib/network.js";
var _4 = "dpapp-core@1.2.1/lib/apis.js";
var _5 = "dpapp-core@1.2.1/lib/decorate.js";
var _6 = "dpapp-core@1.2.1/lib/queue.js";
var _7 = "dpapp-core@1.2.1/lib/index.js";
var asyncDepsToMix = {};
var globalMap = asyncDepsToMix;
define(_7, [_0,_1,_2,_3], function(require, exports, module, __filename, __dirname) {
var Core = require('./core');
var NativeCore = require('./native-core');
var Network = require('./network');
var Promise = require('promise');

Core.prototype._mixin(Core.prototype, NativeCore);
Core.prototype._mixin(Core.prototype, Network);
Core.prototype.all = function(list){
	return Promise.all(list);
};
module.exports = Core;
}, {
    main:true,
    map:mix({"./core":_1,"./native-core":_2,"./network":_3},globalMap)
});

define(_1, [_4,_5], function(require, exports, module, __filename, __dirname) {
function mixin(to, from) {
  for (var key in from) {
    to[key] = from[key];
  }
  return to;
}

var Core = module.exports = function(options){
  options = options || {};
  var self = this;
  for(var key in options){
    this[key] = options[key];
  }


  var apis = options.apis || require('./apis');
  (options.extraApis || []).forEach(function(name){
    if(apis.indexOf(name) === -1){
      apis.push(name);
    }
  });

  this.apis = apis;
  this.allowBeforeReady = this.allowBeforeReady || ["getRequestId"];


  apis.forEach(function(name) {
    if(!self[name]){
      self[name] = function(options) {
        self._send(name, options);
      }
    }
  });

  this.decorate();
};

Core.prototype = {
  _cfg: {
    debug: false
  },
  _isProduct: !!location.href.match(".dianping.com"),
  _isReady: false,
  config: function(config) {
    for(var key in config){
      this._cfg[key] = config[key];
    }
  },
  /**
   * 是否为古早版本
   */
  isOldVersion: function(){
    return false;
  },
  getQuery: function (){
    var query = location.search.slice(1);
    var ret = {};
    query.split("&").forEach(function(pair){
      var splited = pair.split("=");
      ret[splited[0]] = splited[1];
    });
    return ret;
  },
  patchForType: function(version, patch){
    if(this.uaType() == version){
      this.extend(patch);
      this.decorate();
    }
  },
  decorate: require('./decorate'),
  Semver: {
    eq: function(a, b) {
      return a === b;
    },
    gt: function(a, b) {
      var splitedA = a ? a.split(".") : [];
      var splitedB = b ? b.split(".") : [];
      [0,1,2].forEach(function(i){
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
  },
  _parseUA: function(ua){
    var osName, osVersion, versionMatch;
    if (ua.match(/iPhone/)) {
      osName = "iphone";
      osVersion = ua.match(/iPhone\sOS\s([\d_]+)/i)[1].replace(/_/g, ".");
    } else if (ua.match(/Android/)) {
      osName = "android";
      versionMatch = ua.match(/Android[\s|\/]([\w\.]+)/);
      osVersion = versionMatch && versionMatch[1];
    } else {
      osName = null;
      osVersion = null;
    }
    return {
      name: osName,
      version: osVersion
    }
  },
  getTypeFromUA: function(userAgent){
    return /dp\/com\.dianping\.(\w+)\//.test(userAgent)
      ? userAgent.match(/dp\/com\.dianping\.(\w+)\//)[1]
      : "web"
  },
  uaType: function(){
    return this.getTypeFromUA(navigator.userAgent);
  },
  _trace: function(name, params){
    if(!this.hippoPrefix){return;}
    var logFact = (this._cfg && this._cfg.logFact) || 0.05;
    params = params || {};
    params = this._mixin(params, {
      module: this.hippoPrefix + "_" + name
    });
    if(Math.random() < logFact){
      console.log("_trace", name)
      window._hip && _hip.push(['mv', params]);
    }
  },
  log: function() {

    var message = [];
    for(var i=0; i < arguments.length; i++){
      if(typeof arguments[i] == "string"){
        message.push(arguments[i]);
      }else if(arguments[i] != undefined){
        message.push(JSON.stringify(arguments[i]));
      }
    }

    message = message.join(" ");
    if (this._cfg && this._cfg.debug) {
      setTimeout(function(){
        alert(message);
      });
    }else{
      console.log(message);
    }
  },
  _mixin: mixin,
  extend: function(args) {
    return this._mixin(this, args);
  },
  _notImplemented: function notImplemented(opt) {
    opt && opt.fail && opt.fail({
      errMsg:"ERR_NOT_IMPLEMENTED"
    });
  },
  isSupport: function(funcName) {
    var api = this[funcName];
    return !!(api
      && typeof api == "function"
      && api != this._notImplemented
      && api._notReady != true)
  }
};

Core.prototype._osUA = Core.prototype._parseUA(navigator.userAgent);
}, {
    map:mix({"./apis":_4,"./decorate":_5},globalMap)
});

define(_2, [_6], function(require, exports, module, __filename, __dirname) {
/**
 * count from 1
 * @type {Number}
 */
var _events = {};
/**
 * mapping for all callbacks
 * @type {Object}
 */
var pageEvents = ["appear", "disappear"];
var queue = require('./queue');
var q = queue(function(data){
  DPApp._doSendMessage(data.method, data.args, data.callback);
});

module.exports = {
	_dequeueTimeout: null,
  _messageQueue : q,
  dequeue: function(){
    var self = this;
    setTimeout(function(){
      DPApp && DPApp.log && DPApp.log("Dequeue");
      clearTimeout(this._dequeueTimeout);
      self._dequeueTimeout = null;
      q.dequeue();
    }, 0);
  },
  ready: function(callback){
    var self = this;
    this._send("ready", {
      success: function(){
        self._isReady = true;
        callback();
      }
    });
  },
  openScheme: function(opt){
    var url = opt.url;
    var extra = opt.extra;
    if(extra){
      url += "?" + this._convertUrlParams(extra);
      delete opt.extra;
      opt.url = url;
    }
    this._send('openScheme', opt);
  },
  _sendMessage: function(method, args, callback){
    var self = this;
    q.push({
      method: method,
      args: args,
      callback: callback
    });
    this._dequeueTimeout = setTimeout(function(){
      self.dequeue();
    },1000);

  },
  // _generateCallbackId: function(){
  //   var rand = Math.floor(Math.random() * 1000);
  //   var timestamp = +new Date();
  //   return +(timestamp + "" + rand);
  // },
  _generateCallbackId: function () {
    var rand = Math.floor(Math.random() * 1000);
    var timestampStr = (+new Date()).toString();
    //在DPAPP老版本中callbackId为int型，故只选取8位
    var timestamp = timestampStr.substr(timestampStr.length - 5, 5);
    return +(timestamp + "" + rand);
  },
  _generateCallbackName: function(callbackId){
    return "DPApp_callback_" + callbackId;
  },
  /**
   * send message to native
   * @param  {String}   method
   * @param  {Object}   args
   * @param  {Function} callback
   */
  _doSendMessage: function (method, args, callback) {
      var hasCallback = callback && typeof callback == 'function';
      this.log('调用方法', method, args);

      /**
       * pass 0 as callbackId
       * thus _callbacks[callbackId] is undefined
       * nothing will happen
       * @type {Number}
       */
      var callbackId = hasCallback ? this._generateCallbackId() : 0;
      
      if (hasCallback){
        window[this._generateCallbackName(callbackId)] = callback;
      }

      /**
       * check type for args
       */
      if(!args || typeof args !== 'object'){
        args = {};
      }

      // 某些版本app很任性的把callbackId参数放到args里了
      args.callbackId = callbackId;
      args = JSON.stringify(args);

      var bridgeUrl = 'js://_?method=' + method + '&args=' + encodeURIComponent(args) + '&callbackId=' + callbackId;

      this.log('创建iframe ' + method, "callbackId:" + callbackId);
      this._createIframe(bridgeUrl);
  },
  _createNode: function(src, type){
    /**
     * create node
     * and native will intercept and handle the process
     */
    var node = document.createElement(type);
    node.style.display = 'none';

    function removeNode(){
      node.onload = node.onerror = null;
      node.parentNode && node.parentNode.removeChild(node);
    }
    /**
     * remove node after loaded
     */
    node.onload = node.onerror = removeNode;
    setTimeout(removeNode, 5000);
    node.src = src;
    document.body.appendChild(node);
  },
  _createIframe: function(src){
    this._createNode(src, "iframe");
  },
  _send: function(method, args){
    args = args || {};
    var self = this;
    var _success = args.success;
    var _fail = args.fail;
    var _handle = args.handle;

    var fail = function(result){
      self.log('调用失败 ' + method, result);
      _fail && _fail.call(self, result);
    }

    var success = function(result){
      self.log('调用成功 ' + method, result);
      _success && _success.call(self, result);
    }

    var handle = function(result){
      self.log('回调 ' + method, result);
      _handle && _handle.call(self, result);
    }

    var callback = (_success || _fail || _handle) ? function(result){
      var status = result.status;
      if(result.result != "next"){
        delete result.result;
      }
      if(status == "success"){
        success && success(result);
      }else if(status == "action"){
        handle && handle(result);
      }else{
        fail && fail(result);
      }
    } : null;

    this._sendMessage(method, args, callback);

  },

  _convertUrlParams: function(params){
    var result = [];
    for(var i in params){
      result.push(i + "=" + encodeURIComponent(params[i]));
    }
    return result.join("&");
  },
  _sanitizeAjaxOpts: function(args){
    args.method = args.method || "get";
    args.data = args.data || "";
    var url = args.url;
    var data = args.data;

    if (args.method == "get") {
      var params = [];
      for (var p in data) {
        if (data.hasOwnProperty(p) && (data[p] || data[p] === 0)) {  // allow `something=0' param
          params.push(p + '=' + encodeURIComponent(data[p]));
        }
      }

      if (params.length) {
        url += url.indexOf('?') == -1 ? "?" : "&";
        url += params.join('&');
      }
      args.url = url;
      delete args.data;
    }
    return args;
  },
  _parseFeed: function(f){
    var feed;
    if (!f) {
      return 0xff;
    } else if (f.constructor.toString().indexOf("Array") >= 0) {
      feed = [0, 0, 0, 0, 0, 0, 0, 0];
      f.forEach(function(pos) {
        feed[7 - pos] = 1;
      });
      return parseInt(feed.join(""), 2);
    }
  },
  _transModel: function(keys, obj){
    if(!keys){return obj;}
    var keymap = {};

    function getHash(str) {
      var hashCode = function(str) {
        var hash = 0,
          i, chr, len;
        if (str.length == 0) return hash;
        for (i = 0, len = str.length; i < len; i++) {
          chr = str.charCodeAt(i);
          hash = ((hash << 5) - hash) + chr;
          hash |= 0; // Convert to 32bit integer
        }
        return hash;
      };

      var i = hashCode(str);
      return "0x" + ((0xFFFF & i) ^ (i >>> 16)).toString(16);
    }

    function generateKeys(keys) {
      keys.forEach(function(key) {
        keymap[getHash(key)] = key;
      });
    }

    function isArray(val) {
      return Object.prototype.toString.call(val) == "[object Array]";
    }

    function isObject(val) {
      return Object.prototype.toString.call(val) == "[object Object]";
    }

    function translate(obj){
      if (isObject(obj)) {
        delete obj.__name;
        for (var key in obj) {
          var val;
          if (keymap[key]) {
            val = obj[keymap[key]] = obj[key];
            translate(val);
            delete obj[key];
          }
        }
      } else if (isArray(obj)) {
        obj.forEach(function(item) {
          translate(item);
        });
      }
      return obj;
    }

    keys.forEach(function(key) {
      keymap[getHash(key)] = key;
    });

    return translate(obj);
  },
  _capital: function(str){
    return str.slice(0,1).toUpperCase() + str.slice(1);
  },
  subscribe : function(opt) {
    var self = this;
    var name = opt.action;
    var success = opt.success;
    var handle = opt.handle;
    var messageName;

    function mainHandler(e){
      _events[name] && _events[name].length && _events[name].forEach(function(func) {
        func && func(e);
      });
    }

    function registerPageEvents(){
      if(messageName){
        self[messageName] = mainHandler;
        opt.success && opt.success();
      }
    }

    if (_events[name]) {
      opt.success && opt.success();
      _events[name].push(handle);
    } else {
      if(pageEvents.indexOf(name) != -1){
        messageName = "on" + self._capital(name);
        if(name == 'scroll'){
          // 仅scroll事件需要toggle开关
          this._send(messageName, {
            success: registerPageEvents
          });
        }else{
          // 不然就直接注册上了
          registerPageEvents();
        }
      }else{
        this._send("subscribe", {
          action: name,
          success: opt.success,
          handle: mainHandler
        });
      }

      _events[name] = [handle];
    }
  },

  unsubscribe : function(opt) {
    var name = opt.action;
    var success = opt.success;
    var handle = opt.handle;
    var self = this;

    var index = _events[name] ? _events[name].indexOf(handle) : -1;

    function unregisterPageEvents(){
      self[callbackName] = NOOP;
    }

    if (index != -1) {
      _events[name].splice(index, 1);
      success && success();
      if(!_events[name].length){
        _events[name] = null;
      }
    }else if(!handle){
      _events[name] = null;
    }

    if(!_events[name]){
      // unregister
      // if is page event
      if(pageEvents.indexOf(name) != -1 && after7_6){
        var messageName = "off" + self._capital(name);
        var callbackName = "on" + self._capital(name);
        // 与安卓确认
        if(name == 'scroll'){
          this._send(messageName, {
            success: unregisterPageEvents
          });
        }else{
          unregisterPageEvents();
        }
      }else{
        this._send("unsubscribe", {
          action: name,
          success: success
        });
      }
    }
    // if not found, remove all;
  },

  getUA: function(){},
  /**
   * callback function to be invoked from native
   * @param  {Number} callbackId
   * @param  {Object} retValue
   */
  callback: function(callbackId, retValue){
    var win = window;
    var callbackFuncName = this._generateCallbackName(callbackId);
    var callback = window[callbackFuncName];

    if(callback){
      this.log("触发回调 ", "callbackId:" + callbackId);
      setTimeout(function(){
        callback && callback.call(self,retValue);
      });
      if(retValue.result == "complete" || retValue.result == "error"){
        win[callbackFuncName] = null;
        delete win[callbackFuncName];
      }
    }
  }
};
}, {
    map:mix({"./queue":_6},globalMap)
});

define(_3, [], function(require, exports, module, __filename, __dirname) {
module.exports = {
  _iOSNetworkType: function (result) {
    var networkType;
    var types = {
      kSCNetworkReachabilityFlagsTransientConnection: 1 << 0,
      kSCNetworkReachabilityFlagsReachable: 1 << 1,
      kSCNetworkReachabilityFlagsConnectionRequired: 1 << 2,
      kSCNetworkReachabilityFlagsConnectionOnTraffic: 1 << 3,
      kSCNetworkReachabilityFlagsInterventionRequired: 1 << 4,
      kSCNetworkReachabilityFlagsConnectionOnDemand: 1 << 5,
      kSCNetworkReachabilityFlagsIsLocalAddress: 1 << 16,
      kSCNetworkReachabilityFlagsIsDirect: 1 << 17,
      kSCNetworkReachabilityFlagsIsWWAN: 1 << 18
    };
    var type = +result.type;
    var subType = result.subType;
    var returnValue;
    // 2g, 3g, 4g
    function getMobileType(subType) {
      switch (subType) {
        case "CTRadioAccessTechnologyGPRS":
        case "CTRadioAccessTechnologyEdge":
        case "CTRadioAccessTechnologyCDMA1x":
          return "2g";
        case "CTRadioAccessTechnologyLTE":
          return "4g";
        case "CTRadioAccessTechnologyWCDMA":
        case "CTRadioAccessTechnologyHSDPA":
        case "CTRadioAccessTechnologyHSUPA":
        case "CTRadioAccessTechnologyCDMA1x":
        case "CTRadioAccessTechnologyCDMAEVDORev0":
        case "CTRadioAccessTechnologyCDMAEVDORevA":
        case "CTRadioAccessTechnologyCDMAEVDORevB":
        case "CTRadioAccessTechnologyeHRPD":
          return "3g";
      }
    }

    if ((type & types.kSCNetworkReachabilityFlagsReachable) == 0) {
      return "none";
    }

    if ((type & types.kSCNetworkReachabilityFlagsConnectionRequired) == 0) {
      // if target host is reachable and no connection is required
      //  then we'll assume (for now) that your on Wi-Fi
      returnValue = "wifi";
    }


    if (
      (type & types.kSCNetworkReachabilityFlagsConnectionOnDemand) != 0
      ||
      (type & types.kSCNetworkReachabilityFlagsConnectionOnTraffic) != 0
    ) {
      // ... and the connection is on-demand (or on-traffic) if the
      //     calling application is using the CFSocketStream or higher APIs
      if ((type & types.kSCNetworkReachabilityFlagsInterventionRequired) == 0) {
        // ... and no [user] intervention is needed
        returnValue = "wifi";
      }
    }

    if ((type & types.kSCNetworkReachabilityFlagsIsWWAN) == types.kSCNetworkReachabilityFlagsIsWWAN) {
      // ... but WWAN connections are OK if the calling application
      //     is using the CFNetwork (CFSocketStream?) APIs.
      returnValue = getMobileType(subType);
    }

    return returnValue;
  },
  _androidNetworkType: function (result) {
    var type = result.type;
    var subType = result.subType;

    if (type == 0) {
      switch (subType) {
        case 1:
        case 2:
        case 4:
        case 7:
        case 11:
          return "2g";
        case 3:
        case 5:
        case 6:
        case 8:
        case 9:
        case 10:
        case 12:
        case 14:
        case 15:
          return "3g";
        case 13:
          return "4g";
      }
    }

    if (type == 1) {
      return "wifi";
    } else {
      return "none";
    }
  },
  getNetworkType : function(opt) {
    var self = this;
    var _success = opt.success;

    this._send("getNetworkType", {
      success: function(result) {
        var ua = self._osUA;
        var networkType;

        switch (ua.name) {
          case "iphone":
            networkType = this._iOSNetworkType(result);
            break;
          case "android":
            networkType = this._androidNetworkType(result);
            break;
        }

        _success && _success({
          networkType: networkType,
          raw: {
            type: result.type,
            subType: result.subType
          }
        });
      },
      fail: opt.fail
    });
  }
}
}, {
    map:globalMap
});

define(_4, [], function(require, exports, module, __filename, __dirname) {
module.exports = [
  "getVersion", "getNetworkType", "getContactList", "pickContact",
  "getRequestId", "getDeviceInfo", "clearStorage", "store", "retrieve", "publish", "subscribe", "unsubscribe", "openScheme", "jumpToScheme", "closeWindow", "sendSMS",
  "downloadImage", "setBackgroundColor", "setTitle", "setLLButton", "setLRButton", "setRLButton", "setRRButton", "isInstalledApp",
  "alert", "prompt", "confirm", "actionSheet"
];
}, {
    map:globalMap
});

define(_5, [_0], function(require, exports, module, __filename, __dirname) {
var Promise = require('promise');

module.exports = function (allowBeforeReady){
  var target = this;
  var apis = this.apis;
  var allowBeforeReady = this.allowBeforeReady;

  apis.forEach(function(name){
    if(!target[name]){
      target[name] = target._notImplemented;
    }
  });

  apis.forEach(function(api){
    var _origin = target[api];
    if(target[api] && target[api]._decorated){
      return;
    }
    target[api] = function(args){
      var _args = target._mixin({}, args);
      target._trace(api + "_call");
      var _success = _args.success;
      var _fail = _args.fail;
      var _wrapped_fail = function(result){
        if(!_fail){
          if(target.onerror){
            target.onerror({
              api: api,
              err: result
            });
          }else{
            var errorMessage = result.errMsg ? result.errMsg : JSON.stringify(result);
            var err = new Error(errorMessage);
            err.name = "DPAppError";
            console.warn("`DPApp." + api + "` call faild");
            target._trace('throw');
            console.warn(new Error(err));
          }
        }else{
          _fail(result);
        }
      }
      var zero = +new Date;
      _args.success = function(result){
        target._trace(api + "_success", {
          time: +new Date - zero,
        });
        _success && _success(result);
      };
      _args.fail = function(result){
        var note = {};
        note.args = args;
        note.result = result;
        target._trace(api + "_fail", {
          time: +new Date - zero,
          note: JSON.stringify(note)
        });
        _wrapped_fail(result);
      }

      if(!this._isReady
        && allowBeforeReady.indexOf(api) === -1
        && !target._isProduct // 非正式环境
        && target.isOldVersion() // 且非新版本，为了判断环境，必须wrap在DPApp.ready中
      ){
        _wrapped_fail("use `DPApp.ready(fn)` to wrap api calls");
        return;
      }

      return new Promise(function(resolve, reject){
        var origin_success = _args.success;
        var origin_fail = _args.fail;
        var success = function(result){
          origin_success(result);
          resolve(result);
        }
        var fail = function(result){
          origin_fail(result);
          if(!_fail){
            reject(result);
          }
        }
        _args.success = success;
        _args.fail = fail;
        _origin.call(target, _args);
      });
    }
    target[api]._decorated = true;
    target[api]._notReady = _origin == target._notImplemented;

  });
}
}, {
    map:globalMap
});

define(_6, [], function(require, exports, module, __filename, __dirname) {
var queue = module.exports = function(worker){
	var currentData = null;
	var currentCallback = null;
	var q = {
		timeout: null,
		running : false,
		tasks: [],
		push: function(data, cb){
			var callback = cb || function(data){}
			q.tasks.push({
				data: data,
				callback: callback
			});
			setTimeout(function(){
				q.process();
			}, 0);
		},
		dequeue: function(){
			if(currentCallback){
				currentCallback();
			}else{
				q.running = false;
			}
		},
		process: function(){
			if(q.tasks.length && !q.running){
				var task = q.tasks.shift();
				q.running = true;
				currentCallback = function(){
					q.running = false;
					task.callback(task.data);
					q.process();
				};
				currentData = task.data;
				worker(task.data, currentCallback);
			}
		}
	}
	return q;
};
}, {
    map:globalMap
});
})();