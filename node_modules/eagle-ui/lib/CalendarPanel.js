'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactLibReactDOM = require('react/lib/ReactDOM');

var _reactLibReactDOM2 = _interopRequireDefault(_reactLibReactDOM);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _utilsClassNameMixinJs = require('./utils/ClassNameMixin.js');

var _utilsClassNameMixinJs2 = _interopRequireDefault(_utilsClassNameMixinJs);

var _utilsComponent = require('./utils/Component');

var _utilsComponent2 = _interopRequireDefault(_utilsComponent);

var _InputJs = require('./Input.js');

var _InputJs2 = _interopRequireDefault(_InputJs);

var _CalendarJs = require('./Calendar.js');

var _CalendarJs2 = _interopRequireDefault(_CalendarJs);

/**
 * CalendarPanel组件<br>
 * 接受Calendar的所有属性接口，额外增加一个getValueCallback方法
 *
 * 主要属性接口:
 * <ul>
 *     <li>getValueCallback参数为<code>格式化后的string</code></li>
 *     <li style='color:red'><a href='./Calendar.html'>其他属性定义请参照Calendar组件</a></li>
 * </ul>
 *
 * @class CalendarPanel
 * @module ui
 * @extends Component
 * @constructor
 * @demo  star.js {UI展示}
 * @demo  calendar.js {源码}
 * @show true
 * */

var CalendarPanel = (function (_Component) {
    _inherits(CalendarPanel, _Component);

    CalendarPanel.prototype.getFormat = function getFormat() {
        var formatMap = {
            date: this.props.format || 'yyyy-MM-dd',
            month: this.props.monthFormat || 'MM',
            year: this.props.yearFormat || 'yyyy',
            yearMonth: this.props.yearMonthFormat || 'yyyy-MM'
        };
        return formatMap[this.props.calendarType];
    };

    CalendarPanel.prototype.getWindowType = function getWindowType() {
        var typeMap = {
            date: 0,
            month: 1,
            year: 2,
            yearMonth: 1
        },
            windowType = typeMap[this.props.calendarType] ? typeMap[this.props.calendarType] : 0;
        return windowType;
    };

    _createClass(CalendarPanel, null, [{
        key: 'propTypes',
        value: {
            showCallback: _react.PropTypes.func,
            hideCallback: _react.PropTypes.func,
            componentTag: _react.PropTypes.string,
            /**
             * 通过传入此函数获取日期值
             * @event  getValueCallback
             * @param {string} date 日期
             * */
            getValueCallback: _react.PropTypes.func
        },
        enumerable: true
    }, {
        key: 'defaultProps',
        value: {
            classPrefix: 'calendar',
            componentTag: 'Input',
            calendarType: 'date',
            getValueCallback: function getValueCallback(date) {
                console.warn('通过向CalendarPanel传入回调函数"getValueCallback"可以获取到当前选取的日期值，当前选取的日期为：' + date);
            }
        },
        enumerable: true
    }]);

    function CalendarPanel(props, context) {
        _classCallCheck(this, _CalendarPanel);

        _Component.call(this, props, context);
        this.calendarContainer = this.uniqueId();
        this.inputId = this.uniqueId();
        this.state = {
            isShow: false,
            value: this.props.defaultDate || '',
            windowType: this.getWindowType()
        };
    }

    CalendarPanel.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        this.setState({
            value: nextProps.defaultDate
        });
    };

    CalendarPanel.prototype.doSetCapture = function doSetCapture(input) {
        if (input.setCapture) {
            this.doReleaseCapture();
            input.setCapture();
            this.ctObj = input;
        }
    };

    CalendarPanel.prototype.doReleaseCapture = function doReleaseCapture() {
        if (this.ctObj && this.ctObj.releaseCapture) {
            this.ctObj.releaseCapture();
            this.ctObj = null;
        }
    };

    CalendarPanel.prototype.componentDidMount = function componentDidMount() {};

    CalendarPanel.prototype.inputBlurHandler = function inputBlurHandler() {
        this.doReleaseCapture();
        this.close();
    };

    CalendarPanel.prototype.inputMouseUpHandler = function inputMouseUpHandler() {
        this.doReleaseCapture();
    };

    CalendarPanel.prototype.inputFocusHandler = function inputFocusHandler(e) {

        var container = _reactLibReactDOM2['default'].findDOMNode(this.refs[this.calendarContainer]),
            _this = this,
            calendar = container.querySelector('.' + this.getClassName('container')),
            input = e.target;

        calendar.onmousedown = function (e) {
            _this.doSetCapture(input);
            return false;
        };
        this.input = input;
        this.setState({
            isShow: true,
            windowType: this.getWindowType()
        });
    };

    CalendarPanel.prototype.inputChangeHandler = function inputChangeHandler(e) {
        var target = e.target;

        this.setState({
            value: target.value
        });
    };

    CalendarPanel.prototype.selectCallback = function selectCallback(date) {
        this.props.getValueCallback(date);
        this.setState({
            value: date
        });
    };

    CalendarPanel.prototype.setWindowType = function setWindowType(type) {
        this.setState({
            windowType: type
        });
    };

    CalendarPanel.prototype.close = function close() {
        this.setState({
            isShow: false
        });
        this.input && this.input.blur();
    };

    CalendarPanel.prototype.dateChange = function dateChange(d) {
        this.refs[this.calendarContainer + 'calendar'].dateChange(d);
        this.setState({
            value: d
        });
    };

    CalendarPanel.prototype.render = function render() {
        var _this2 = this;

        var Component = this.props.componentTag;
        var _this = this;
        var options = _react2['default'].Children.map(this.props.children, function (option) {

            return _react2['default'].createElement(_InputJs2['default'], _extends({}, option.props, {
                ref: _this2.inputId,
                onBlur: _this.inputBlurHandler.bind(_this),
                onMouseUp: _this.inputMouseUpHandler.bind(_this),
                onFocus: _this.inputFocusHandler.bind(_this),
                value: _this.state.value,
                onChange: _this.inputChangeHandler.bind(_this),
                icon: option.props.icon,
                iconClickCallback: (function () {
                    _reactLibReactDOM2['default'].findDOMNode(this.refs[this.inputId]).getElementsByTagName('input')[0].focus();
                }).bind(_this2)
            }));
        }, this);

        return _react2['default'].createElement(
            'div',
            { className: _classnames2['default'](this.getClassName('panel')), ref: this.calendarContainer },
            options,
            _react2['default'].createElement(_CalendarJs2['default'], _extends({
                format: this.getFormat()
            }, this.props, {
                ref: this.calendarContainer + 'calendar',
                show: this.state.isShow,
                selectCallback: this.selectCallback.bind(this),
                windowType: this.state.windowType,
                closeCallback: this.close.bind(this),
                setWindowType: this.setWindowType.bind(this) }))
        );
    };

    var _CalendarPanel = CalendarPanel;
    CalendarPanel = _utilsClassNameMixinJs2['default'](CalendarPanel) || CalendarPanel;
    return CalendarPanel;
})(_utilsComponent2['default']);

exports['default'] = CalendarPanel;
module.exports = exports['default'];