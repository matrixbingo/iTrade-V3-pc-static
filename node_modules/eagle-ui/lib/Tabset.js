/**
 * Created by mac on 15/9/7.
 */
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utilsClassNameMixin = require('./utils/ClassNameMixin');

var _utilsClassNameMixin2 = _interopRequireDefault(_utilsClassNameMixin);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _TabJs = require('./Tab.js');

var _TabJs2 = _interopRequireDefault(_TabJs);

var _reactLibReactDOM = require('react/lib/ReactDOM');

var _reactLibReactDOM2 = _interopRequireDefault(_reactLibReactDOM);

/**
 * 导航标签组件，用户可以在不同的tab之间进行切换<br/>
 * 需要和Tab组件配合使用,Tabset相当于是Tab的容器
 * @class Tabset
 * @module ui
 * @extends Component
 * @constructor
 * @since 0.1.0
 * @demo star.js {UI展示}
 * @demo tab.js {源码}
 * @show true
 * */

var Tabset = (function (_Component) {
    _inherits(Tabset, _Component);

    _createClass(Tabset, null, [{
        key: 'defaultProps',
        value: {
            classPrefix: 'tabset',
            activeTab: 0
        },
        enumerable: true
    }, {
        key: 'propTypes',
        value: {
            /**
             * 需要在初始的时候打开第几个tab，默认为0（从0计数，即打开第一个tab）
             * @property activeTab
             * @type Number
             * @default 0
             * */
            activeTab: _react.PropTypes.number,
            /**
             * 回调方法，当用户切换不同tab时，会调用这个回调。
             * @event  tabCallback
             * @param {Number} activeTabIndex 当前激活的是第几个tab，从0开始计数
             * @default undefined
             * */
            tabCallback: _react.PropTypes.func,
            disableHoverAnimation: _react.PropTypes.bool
        },
        enumerable: true
    }]);

    function Tabset(props, context) {
        _classCallCheck(this, _Tabset);

        _Component.call(this, props, context);
        this.state = {
            active: props.activeTab,
            tabSlider: {
                left: 0,
                width: 0
            }
        };
        if (this.props.tabCallback) {
            this.props.tabCallback(props.activeTab);
        }
    }

    Tabset.prototype.highlightTab = function highlightTab() {
        var activeTab = _reactLibReactDOM2['default'].findDOMNode(this.refs['tabItem' + this.state.active]);
        var slider = _reactLibReactDOM2['default'].findDOMNode(this.refs['slider']);

        slider.style.width = activeTab.offsetWidth + 'px';
        slider.style.left = activeTab.offsetLeft + 'px';
    };

    Tabset.prototype.componentDidMount = function componentDidMount() {
        //this.tabItemListMouseLeaveHandler();
        this.highlightTab();
    };

    Tabset.prototype.componentDidUpdate = function componentDidUpdate() {
        this.highlightTab();
    };

    Tabset.prototype.componentWillReceiveProps = function componentWillReceiveProps(props) {
        if (props.activeTab != undefined) {
            this.setState({
                active: props.activeTab
            });
        }
    };

    Tabset.prototype.activeHandler = function activeHandler(index) {
        if (this.state.active !== index) {
            this.setState({
                active: index
            });
            if (this.props.tabCallback) {
                this.props.tabCallback(index);
            }
        }
    };

    Tabset.prototype.tabItemListMouseLeaveHandler = function tabItemListMouseLeaveHandler() {
        //let activeTab=ReactDom.findDOMNode(this.refs['tabItem'+this.state.active]);
        //this.timeoutObj=setTimeout(function(){
        //    this.tabItemMouseEnterHandler(activeTab.offsetLeft,activeTab.offsetWidth);
        //}.bind(this),400);
    };

    Tabset.prototype.tabItemMouseEnterHandler = function tabItemMouseEnterHandler(left, width) {
        //clearTimeout(this.timeoutObj);
        //clearTimeout(this.timeoutEnter);
        //this.timeoutEnter = setTimeout(function(){
        //    this.setState({
        //        tabSlider:{
        //            left,
        //            width
        //        }
        //    });
        //}.bind(this),200);

    };

    Tabset.prototype.render = function render() {
        var _this = this;

        var headings = _react2['default'].Children.map(this.props.children, function (option, index) {
            var _option$props = option.props;
            var tabCallback = _option$props.tabCallback;

            var other = _objectWithoutProperties(_option$props, ['tabCallback']);

            return _react2['default'].createElement(_TabJs2['default'], _extends({
                disableHoverAnimation: _this.props.disableHoverAnimation ? true : false,
                ref: 'tabItem' + index,
                index: index,
                active: _this.state.active === index,
                clickCallback: _this.activeHandler.bind(_this),
                mouseEnterCallback: _this.tabItemMouseEnterHandler.bind(_this)
            }, other));
        }, this);
        var panes = _react2['default'].Children.map(this.props.children, function (option, index) {
            return _react2['default'].createElement(
                'div',
                {
                    className: _classnames2['default'](_this.getClassName('panes')),
                    style: { display: _this.state.active === index ? null : 'none' }
                },
                option.props.children
            );
        }, this);
        return _react2['default'].createElement(
            'div',
            null,
            _react2['default'].createElement(
                'ul',
                { className: _classnames2['default'](this.getClassName('tab-list')),
                    onMouseLeave: this.tabItemListMouseLeaveHandler.bind(this) },
                headings,
                _react2['default'].createElement(
                    'li',
                    { className: _classnames2['default'](this.getClassName('slider-container')) },
                    _react2['default'].createElement('div', { ref: 'slider', className: _classnames2['default'](this.getClassName('slider')) })
                )
            ),
            _react2['default'].createElement(
                'div',
                { className: _classnames2['default'](this.getClassName('tab-content')) },
                panes
            )
        );
    };

    var _Tabset = Tabset;
    Tabset = _utilsClassNameMixin2['default'](Tabset) || Tabset;
    return Tabset;
})(_react.Component);

exports['default'] = Tabset;
module.exports = exports['default'];