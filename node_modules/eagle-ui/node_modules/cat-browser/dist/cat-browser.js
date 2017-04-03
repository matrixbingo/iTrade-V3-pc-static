(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _Browser = __webpack_require__(2);

	var _Browser2 = _interopRequireDefault(_Browser);

	exports.CatBrowser = _Browser2['default'];

	if (typeof CatBrowser == 'undefined') {
	    window.CatBrowser = exports['CatBrowser'];
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _Cookie = __webpack_require__(3);

	var _Cookie2 = _interopRequireDefault(_Cookie);

	var _UserAgent = __webpack_require__(5);

	var _UserAgent2 = _interopRequireDefault(_UserAgent);

	var _Options = __webpack_require__(6);

	var _Options2 = _interopRequireDefault(_Options);

	/**
	 * 页面加载，判断是否存在cookie
	 * 是，不做任何处理
	 * 否，获取浏览器信息，
	 * 自定义信息：模块名称,等发送给后端
	 * 设置cookie，自定义过期时间
	 * */

	var Browser = (function () {
	    function Browser() {
	        var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	        _classCallCheck(this, Browser);

	        //兼容低版本浏览器，不用Object.assign
	        this.opts = this.extendObj(_Options2['default'], opts);
	        this.isOnlyDp = this.opts.isOnlyDp;
	        this.cookie = new _Cookie2['default']();
	        this.userAgent = new _UserAgent2['default']();
	        //是否监控
	        this.isCat = true;
	        //是否必须dp环境下，再次判断是否监控
	        this.isOnlyDp && this.isDpEnv();
	        this.isCat && this.initHanlder();
	    }

	    /**
	     * 初始化方法
	     * */

	    Browser.prototype.initHanlder = function initHanlder() {
	        var isFirst = this.isFirstVisit();
	        isFirst && this.getUserInfo();
	    };

	    /**
	     * 是否规定时间内第一次访问
	     * */

	    Browser.prototype.isFirstVisit = function isFirstVisit() {
	        var Cookies = this.cookie,
	            CName = this.opts.cookieName,
	            CValue = this.opts.cookieValue;
	        if (Cookies.get(CName) == CValue) {
	            return false;
	        } else {
	            Cookies.set(CName, CValue, { expires: this.opts.expiresTime });
	            return true;
	        }
	    };

	    /**
	     * 其他必要信息
	     * */

	    Browser.prototype.getData = function getData(browserName) {
	        /**
	         * 对应catjs报警接口
	         * 字段文档http://cat.dp/cat/r/home?op=view&docName=browserMonitor
	         */
	        var data = {
	            v: 1,
	            t: +new Date(),
	            msg: 'browserUseRate',
	            n: this.opts.moduleName,
	            l: 'INFO',
	            a: browserName,
	            data: this.getHost()
	        };
	        return data;
	    };

	    /**
	     * 获取浏览器信息
	     * */

	    Browser.prototype.getUserInfo = function getUserInfo() {
	        var browserName = this.userAgent.getInfo();
	        var data = this.getData(browserName);
	        this.sendMsg(this.format(data));
	    };

	    /**
	     * 发送信息
	     * */

	    Browser.prototype.sendMsg = function sendMsg(data) {
	        var url = this.opts.url;
	        var image = new Image(1, 1);

	        //console.dir(data);
	        image.src = url + "?" + data;
	    };

	    /**
	     * 格式化数据
	     * */

	    Browser.prototype.format = function format(data) {
	        var arr = [];
	        if (data && typeof data == 'object') {
	            for (var _name in data) {
	                arr.push(_name + '=' + data[_name]);
	            }
	        }
	        return arr.join('&');
	    };

	    /**
	     * 原生实现extend
	     * */

	    Browser.prototype.extendObj = function extendObj(target, source) {
	        for (var p in source) {
	            if (source.hasOwnProperty(p)) {
	                target[p] = source[p];
	            }
	        }
	        return target;
	    };

	    /**
	     * 获取当前环境页面的url
	     * */

	    Browser.prototype.getHost = function getHost() {
	        var url = location.href || '';
	        return url;
	    };

	    /**
	     * 获取当前环境。
	     * 商家后台或者阿波罗不同环境
	     * */

	    Browser.prototype.isDpEnv = function isDpEnv() {
	        var dpEnv = this.dpEnv(),
	            url = location.hostname;
	        this.isCat = url.indexOf(dpEnv) > -1 ? true : false;
	    };

	    /**
	     * 当前商家和阿波罗对应的hostname
	     * */

	    Browser.prototype.dpEnv = function dpEnv() {
	        var url = ['e.51ping.com', 'ppe.e.dianping.com', 'e.dianping.com', 'apollo.51ping.com', 'ppea.dper.com', 'a.dper.com'];
	        return url.join('');
	    };

	    return Browser;
	})();

	exports['default'] = Browser;
	;
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _jsCookie = __webpack_require__(4);

	var _jsCookie2 = _interopRequireDefault(_jsCookie);

	var Cookie = (function () {
	    function Cookie() {
	        _classCallCheck(this, Cookie);
	    }

	    Cookie.prototype.set = function set(name, value, opts) {
	        _jsCookie2['default'].set(name, value, opts);
	    };

	    Cookie.prototype.get = function get(name) {
	        return _jsCookie2['default'].get(name);
	    };

	    Cookie.prototype.remove = function remove(name) {
	        _jsCookie2['default'].remove(name);
	    };

	    return Cookie;
	})();

	exports['default'] = Cookie;
	module.exports = exports['default'];

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	 * JavaScript Cookie v2.1.2
	 * https://github.com/js-cookie/js-cookie
	 *
	 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
	 * Released under the MIT license
	 */
	;(function (factory) {
		if (true) {
			!(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else if (typeof exports === 'object') {
			module.exports = factory();
		} else {
			var OldCookies = window.Cookies;
			var api = window.Cookies = factory();
			api.noConflict = function () {
				window.Cookies = OldCookies;
				return api;
			};
		}
	}(function () {
		function extend () {
			var i = 0;
			var result = {};
			for (; i < arguments.length; i++) {
				var attributes = arguments[ i ];
				for (var key in attributes) {
					result[key] = attributes[key];
				}
			}
			return result;
		}

		function init (converter) {
			function api (key, value, attributes) {
				var result;
				if (typeof document === 'undefined') {
					return;
				}

				// Write

				if (arguments.length > 1) {
					attributes = extend({
						path: '/'
					}, api.defaults, attributes);

					if (typeof attributes.expires === 'number') {
						var expires = new Date();
						expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
						attributes.expires = expires;
					}

					try {
						result = JSON.stringify(value);
						if (/^[\{\[]/.test(result)) {
							value = result;
						}
					} catch (e) {}

					if (!converter.write) {
						value = encodeURIComponent(String(value))
							.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
					} else {
						value = converter.write(value, key);
					}

					key = encodeURIComponent(String(key));
					key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
					key = key.replace(/[\(\)]/g, escape);

					return (document.cookie = [
						key, '=', value,
						attributes.expires && '; expires=' + attributes.expires.toUTCString(), // use expires attribute, max-age is not supported by IE
						attributes.path    && '; path=' + attributes.path,
						attributes.domain  && '; domain=' + attributes.domain,
						attributes.secure ? '; secure' : ''
					].join(''));
				}

				// Read

				if (!key) {
					result = {};
				}

				// To prevent the for loop in the first place assign an empty array
				// in case there are no cookies at all. Also prevents odd result when
				// calling "get()"
				var cookies = document.cookie ? document.cookie.split('; ') : [];
				var rdecode = /(%[0-9A-Z]{2})+/g;
				var i = 0;

				for (; i < cookies.length; i++) {
					var parts = cookies[i].split('=');
					var cookie = parts.slice(1).join('=');

					if (cookie.charAt(0) === '"') {
						cookie = cookie.slice(1, -1);
					}

					try {
						var name = parts[0].replace(rdecode, decodeURIComponent);
						cookie = converter.read ?
							converter.read(cookie, name) : converter(cookie, name) ||
							cookie.replace(rdecode, decodeURIComponent);

						if (this.json) {
							try {
								cookie = JSON.parse(cookie);
							} catch (e) {}
						}

						if (key === name) {
							result = cookie;
							break;
						}

						if (!key) {
							result[name] = cookie;
						}
					} catch (e) {}
				}

				return result;
			}

			api.set = api;
			api.get = function (key) {
				return api(key);
			};
			api.getJSON = function () {
				return api.apply({
					json: true
				}, [].slice.call(arguments));
			};
			api.defaults = {};

			api.remove = function (key, attributes) {
				api(key, '', extend(attributes, {
					expires: -1
				}));
			};

			api.withConverter = init;

			return api;
		}

		return init(function () {});
	}));


/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";

	exports.__esModule = true;

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var UserAgent = (function () {
	    function UserAgent() {
	        _classCallCheck(this, UserAgent);
	    }

	    UserAgent.prototype.getInfo = function getInfo() {
	        var browserInfo = this.getBrowserVersion();
	        return browserInfo;
	    };

	    /**
	     * 原本要获得版本号 目前不需要
	     * */

	    UserAgent.prototype.getBrowserVersion = function getBrowserVersion() {
	        var browser = this.getBrowserInfo() + '';
	        //let versionInfo = parseInt((browser + "").replace(/[^0-9.]/ig, ""));
	        return browser;
	    };

	    /**
	     * 获取浏览器类型
	     * */

	    UserAgent.prototype.getBrowserInfo = function getBrowserInfo() {
	        var agent = navigator.userAgent.toLowerCase(),
	            regStr_ie = /msie [\d.]+;/gi;
	        /**
	         * 具体匹配不同浏览器目前不做太详细区分
	         * */
	        var regStr_ff = /\S+\sfirefox\/[\d.]+/gi,
	            regStr_chrome = /chrome\/[\d.]+\s\S+/gi,
	            regStr_saf = /\S+\ssafari\/[\d.]+/gi;
	        var regStr_other = /\S+\s\S+$/gi;
	        //IE
	        if (agent.indexOf("msie") > 0) {
	            return agent.match(regStr_ie);
	        } else {
	            return agent.match(regStr_other);
	        }
	        /* //firefox
	         if (agent.indexOf("firefox") > 0) {
	         return agent.match(regStr_ff);
	         }
	         //Chrome
	         if (agent.indexOf("chrome") > 0) {
	         return agent.match(regStr_chrome);
	         }
	         //Safari
	         if (agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0) {
	         return agent.match(regStr_saf);
	         }*/
	    };

	    return UserAgent;
	})();

	exports["default"] = UserAgent;
	module.exports = exports["default"];

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	var options = {
	  /**
	   * 项目名称
	   * */
	  moduleName: 'cat-browser',
	  /**
	   * cookie过期时间
	   * */
	  expiresTime: 1,
	  /**
	   * 点评id
	   * */
	  dpId: '',
	  /**
	   * 后端对应的url，默认dp，catjs报警接口
	   * 不建议更改，因为字段需保持一致
	   * */
	  url: '//221.181.67.144/web-broker-service/api/js',
	  /**
	   * 可设置cookie名称和value，以判断是否符合规则的登录
	   * 建议设置不易重复的值或者使用默认值
	   * */
	  cookieName: 'catBrowserName',
	  cookieValue: 'catBrowserValue',
	  /**
	   * 是否只在dp环境下,才启用统计功能
	   * 默认不加判断都可统计
	   * */
	  isOnlyDp: false
	};
	exports['default'] = options;
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;