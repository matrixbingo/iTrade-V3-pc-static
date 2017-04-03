'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _Browser = require('./Browser');

var _Browser2 = _interopRequireDefault(_Browser);

exports.CatBrowser = _Browser2['default'];

if (typeof CatBrowser == 'undefined') {
    window.CatBrowser = exports['CatBrowser'];
}