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
 * 定义栅格中的一列，配合Col组件使用
 * <h5>主要的UI属性接口包括:</h5>
 * <ul>
 *     <li>sm:定义宽度占父元素(100%)的sm/12比例</li>
 * </ul><br>
 * 使用方式:
 * <pre><code>&#60;Col sm={5} &#62;&#60;/Col&#62;</code>
 * </pre>
 * @class Col
 * @module grid(布局)
 * @extends Component
 * @constructor
 * @demo star.js {UI展示}
 * @demo Demo1.js {源码}
 * @show true
 * */

var Col = (function (_Component) {
    _inherits(Col, _Component);

    function Col() {
        _classCallCheck(this, Col);

        _Component.apply(this, arguments);
    }

    Col.prototype.initCallback = function initCallback() {
        var sm = this.props.sm;

        //this.setProperty('sm',this.props.egSize+'-'+sm );
        this.setProperty('end', 'end');
        this.setProperty('layer', 'layer');
        //
    };

    Col.prototype.render = function render() {
        var _props = this.props;
        var sm = _props.sm;
        var egSize = _props.egSize;

        return _react2['default'].createElement(
            this.componentTag,
            _extends({}, this.props, { className: _classnames2['default'](this.getProperty(), this.getClassName(egSize + '-' + sm), this.props.className), style: this.getStyles(this.props.style) }),
            this.props.children
        );
    };

    _createClass(Col, null, [{
        key: 'propTypes',
        value: {
            egSize: _react.PropTypes.string,
            /**
             * 是否是最后一列
             * @property end
             * @type Boolean
             * @default false
             * */
            end: _react.PropTypes.bool,
            /**
             * 总宽度为100%(12份)，egSize定义宽度占比父元素(100%)的egSize/12
             * @property sm
             * @type Number
             * @default 12(一整行)
             * */
            sm: _react.PropTypes.number
        },
        enumerable: true
    }, {
        key: 'defaultProps',
        value: {
            classPrefix: 'col',
            componentTag: 'div',
            egSize: 'xs',
            sm: 12
        },
        enumerable: true
    }]);

    return Col;
})(_utilsComponent2['default']);

exports['default'] = Col;
module.exports = exports['default'];