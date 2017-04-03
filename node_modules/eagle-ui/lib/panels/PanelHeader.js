'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames2 = require('classnames');

var _classnames3 = _interopRequireDefault(_classnames2);

var _utilsClassNameMixinJs = require('../utils/ClassNameMixin.js');

var _utilsClassNameMixinJs2 = _interopRequireDefault(_utilsClassNameMixinJs);

/**
 * PanelHeader定义头部区域
 * @class PanelHeader
 * @module panel(面板)
 * @constructor
 * @extends Component
 * @demo star.js {UI展示}
 * @demo panel.js {源码}
 * @show true
 * */

var PanelHeader = (function (_Component) {
    _inherits(PanelHeader, _Component);

    function PanelHeader() {
        _classCallCheck(this, _PanelHeader);

        _Component.apply(this, arguments);
    }

    PanelHeader.prototype.render = function render() {
        var _classnames;

        var renderStyle = this.props.style ? this.props.style : {};
        return _react2['default'].createElement(
            'div',
            { className: _classnames3['default'](this.getClassName('header'), (_classnames = {}, _classnames[this.getClassName('header-flag')] = this.props.leftFlag || false, _classnames), this.props.className), style: renderStyle },
            this.props.children
        );
    };

    _createClass(PanelHeader, null, [{
        key: 'propTypes',
        value: {
            /**
             * 是否要在标题左侧添加高亮flag
             * @property leftFlag
             * @type Boolean
             * @default false
             * */
            leftFlag: _react.PropTypes.bool
        },
        enumerable: true
    }, {
        key: 'defaultProps',
        value: {
            classPrefix: 'panel'
        },
        enumerable: true
    }]);

    var _PanelHeader = PanelHeader;
    PanelHeader = _utilsClassNameMixinJs2['default'](PanelHeader) || PanelHeader;
    return PanelHeader;
})(_react.Component);

exports['default'] = PanelHeader;
module.exports = exports['default'];