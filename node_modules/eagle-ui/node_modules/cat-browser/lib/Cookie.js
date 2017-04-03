'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _jsCookie = require('js-cookie');

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