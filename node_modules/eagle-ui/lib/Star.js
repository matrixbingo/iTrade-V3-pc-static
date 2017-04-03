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
 * 星级评价(Star)组件<br />
 * 提供的UI展示属性接口包括<br/>
 * <ul>
 *     <li>rate：星级评价的分数(满分为100)<code>默认为0</code></li>
 *     <li>size：星星的大小(默认单位为px)<code>默认13*13px</code></li>
 *     <li>disable：是否可以手动设置星星比率<code>默认为true[不可以]</code></li>
 * </ul><br>
 * 使用方式:
 * <pre><code>&#60;Star rate={50} size={10}/&#62;</code>
 * </pre>
 * @class Star
 * @module ui
 * @extends Component
 * @constructor
 * @demo star.js {UI展示}
 * @demo star.js {源码}
 * @show true
 * */

var Star = (function (_Component) {
    _inherits(Star, _Component);

    _createClass(Star, null, [{
        key: 'propTypes',
        value: {
            /**
             * 星级评价分数(满分100)
             * @property Rate
             * @type number
             * @default 0
             * */
            rate: _react.PropTypes.number,
            /**
             * 星星大小
             * @property size
             * @type String||number
             * @default 13  可以取值10-20 默认单位为'px'
             * */
            size: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
            /**
             * 星星是否可以自己设置
             * 设置单位为1个星星
             * @property disable
             * @type boolean
             * @default false
             *
             */
            disable: _react.PropTypes.bool,
            /**
             * 用于不同的css写法导致的位置微调
             */
            adjust: _react.PropTypes.number,
            classPrefix: _react.PropTypes.string
        },
        enumerable: true
    }, {
        key: 'defaultProps',
        value: {
            classPrefix: 'star',
            rate: 0,
            disable: true,
            adjust: 0
        },
        enumerable: true
    }]);

    function Star(props, context) {
        _classCallCheck(this, Star);

        _Component.call(this, props, context);
        this.state = {
            rate: props.rate,
            size: props.size,
            disable: props.disable,
            adjust: props.adjust
        };
        this.Rate = props.rate;
    }

    Star.prototype.renderCustomize = function renderCustomize(e) {
        var disable = this.state.disable;

        var newPositionX = e.clientX;

        var newRate = Math.floor((newPositionX - this.positionX) / this.offsetWidth * 5 + 1) * 20;
        this.setState({
            rate: newRate
        });
        this.props.activeCallback && this.props.activeCallback(newRate);
        this.Rate = newRate;
    };

    Star.prototype.render = function render() {
        var _this = this;

        var _state = this.state;
        var rate = _state.rate;
        var size = _state.size;

        //兼容用户输入px为单位的数据大小
        size = /px/i.test(size) ? size.replace('px', '') : size;
        var customizeStyle = size ? {
            width: size * 5 + 'px',
            height: size - 1 + 'px',
            backgroundSize: size * 5 + 'px auto',
            cursor: !this.state.disable ? 'pointer' : 'hand'
        } : {};
        var shadowPosition = size ? {
            backgroundPosition: "0  -" + size + "px"
        } : {};
        return _react2['default'].createElement(
            'div',
            { className: this.getProperty(),
                style: customizeStyle,
                onMouseMove: function (e) {
                    !_this.state.disable && _this.renderCustomize(e);
                },
                ref: function (targetNode) {
                    var self = _this;
                    function calculateCoor() {
                        var node = targetNode;
                        self.offsetWidth = node.offsetWidth;
                        self.positionX = 0;
                        while (node) {
                            self.positionX += node.offsetLeft;
                            node = node.offsetParent;
                        }
                        self.positionX += self.state.adjust;
                    }
                    if (!_this.positionX) {
                        calculateCoor();
                    }
                    window.onresize = calculateCoor;
                } },
            _react2['default'].createElement('div', { className: this.getClassName('grey'), style: _extends({ width: rate + '%' }, shadowPosition) })
        );
    };

    return Star;
})(_utilsComponent2['default']);

exports['default'] = Star;
module.exports = exports['default'];