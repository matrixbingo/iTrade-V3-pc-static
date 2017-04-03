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

var _PanelHeader = require('./PanelHeader');

var _PanelHeader2 = _interopRequireDefault(_PanelHeader);

var _utilsComponent = require('../utils/Component');

var _utilsComponent2 = _interopRequireDefault(_utilsComponent);

/**
 * <h5>eagle-ui主要面板布局组件</h5>
 * <strong><a href='../classes/Panel.html'>Panel定义整个容器</a></strong><br>
 * <strong><a href='../classes/PanelContent.html'>PanelContent定义内容区域</a></strong><br>
 * <strong><a href='../classes/PanelFooter.html'>PanelFooter定义底部区域</a></strong><br>
 * <strong><a href='../classes/PanelHeader.html'>PanelHeader定义头部区域</a></strong><br>
 * @module panel(面板)
 * @main panel(面板)
 * @static
 */

/**
 * Panel定义整个容器<br />
 * 和PanelHeader,PanelContent,PanelFooter配合使用<br />
 * Panel是上面三个标签的父容器，<br />
 * 可以依据不同情况决定是否添加PanelHeader和PanelFooter
 * @class Panel
 * @module panel(面板)
 * @extends Component
 * @constructor
 * @demo star.js {UI展示}
 * @demo panel.js {源码}
 * @show true
 * */

var Panel = (function (_Component) {
    _inherits(Panel, _Component);

    function Panel() {
        _classCallCheck(this, Panel);

        _Component.apply(this, arguments);
    }

    Panel.prototype.renderHeading = function renderHeading() {
        var heading = this.props.heading;

        if (heading) {
            return _react2['default'].createElement(
                _PanelHeader2['default'],
                { className: this.getClassName('panel-header-flag', false) },
                _react2['default'].createElement(
                    'h4',
                    null,
                    heading
                )
            );
        }

        return null;
    };

    Panel.prototype.render = function render() {
        return _react2['default'].createElement(
            'div',
            _extends({}, this.props, { className: _classnames2['default'](this.getProperty(), this.props.className), style: this.getStyles(this.props.style) }),
            this.renderHeading(),
            this.props.children
        );
    };

    _createClass(Panel, null, [{
        key: 'propTypes',
        value: {
            /**
             * panel的样式风格，默认为default，还可以设置为normal
             * @property egType
             * @type String
             * @default 'default'
             * */
            egType: _react.PropTypes.string,
            /**
             * 标
             * @property heading
             * @type String
             * @default empty
             * */
            heading: _react.PropTypes.string
        },
        enumerable: true
    }, {
        key: 'defaultProps',
        value: {

            egType: 'default',
            classPrefix: 'panel'
        },
        enumerable: true
    }]);

    return Panel;
})(_utilsComponent2['default']);

exports['default'] = Panel;
module.exports = exports['default'];