'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _utilsClassNameMixinJs = require('../utils/ClassNameMixin.js');

var _utilsClassNameMixinJs2 = _interopRequireDefault(_utilsClassNameMixinJs);

/**
 * 表格行组件
 * @class Tr
 * @constructor
 * @module table(表格)
 * @extends Component
 * @demo star.js {UI展示}
 * @demo table.js {源码}
 * @show true
 * */

var Tr = (function (_Component) {
    _inherits(Tr, _Component);

    function Tr() {
        _classCallCheck(this, _Tr);

        _Component.apply(this, arguments);
    }

    Tr.prototype.render = function render() {
        return _react2['default'].createElement(
            'tr',
            _extends({}, this.props, { className: _classnames2['default'](this.props.split ? this.getClassName('split') : null, this.props.className) }),
            this.props.children
        );
    };

    _createClass(Tr, null, [{
        key: 'propTypes',
        value: {
            /**
             * 是否在每一行下添加分割线
             * @property split
             * @type bool
             * @default false
             * */
            split: _react.PropTypes.bool
        },
        enumerable: true
    }, {
        key: 'defaultProps',
        value: {
            classPrefix: 'tr'
        },
        enumerable: true
    }]);

    var _Tr = Tr;
    Tr = _utilsClassNameMixinJs2['default'](Tr) || Tr;
    return Tr;
})(_react.Component);

exports['default'] = Tr;
module.exports = exports['default'];