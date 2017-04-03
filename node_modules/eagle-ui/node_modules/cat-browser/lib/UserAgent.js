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