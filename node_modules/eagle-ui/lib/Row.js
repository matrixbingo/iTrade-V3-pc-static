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

var _utilsComponent = require('./utils/Component');

var _utilsComponent2 = _interopRequireDefault(_utilsComponent);

/**
 * 定义栅格中的一行，配合Col组件使用
 * <h5>提供的UI接口:</h5>
 * <ul>
 *     <li>end:是否显示下边框</li>
 * </ul>
 * @class Row
 * @module grid(布局)
 * @extends Component
 * @constructor
 * @demo star.js {UI展示}
 * @demo Demo1.js {源码}
 * @show true
 * */

var Row = (function (_Component) {
    _inherits(Row, _Component);

    function Row() {
        _classCallCheck(this, Row);

        _Component.apply(this, arguments);
    }

    Row.prototype.render = function render() {

        return _react2['default'].createElement(
            'div',
            _extends({}, this.props, { className: _classnames2['default'](this.getProperty(), 'clearfix', this.props.className), style: this.getStyles(this.props.style) }),
            this.props.children
        );
    };

    _createClass(Row, null, [{
        key: 'propTypes',
        value: {
            /**
             * 样式前缀
             * @property classPrefix
             * @type String
             * @default row
             * */
            classPrefix: _react.PropTypes.string,
            /**
             * 是否显示下划线
             * @property bottom
             * @type boolean
             * @default undefined
             * */
            bottom: _react.PropTypes.bool
        },
        enumerable: true
    }, {
        key: 'defaultProps',
        value: {
            classPrefix: 'row'
        },
        enumerable: true
    }]);

    return Row;
})(_utilsComponent2['default']);

exports['default'] = Row;
module.exports = exports['default'];