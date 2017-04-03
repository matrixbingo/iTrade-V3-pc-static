/**
 * Created by mac on 15/9/7.
 */
'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _InputJs = require('./Input.js');

var _InputJs2 = _interopRequireDefault(_InputJs);

var _utilsComponentJs = require('./utils/Component.js');

var _utilsComponentJs2 = _interopRequireDefault(_utilsComponentJs);

/**
 * CheckboxGroup需与Input组件配合使用<br/>
 * 它的作用是将type=checkbox的Input组件在UI上成组的展示。只起到包装作用没有逻辑功能
 * @class CheckboxGroup
 * @module form(表单)
 * @extends Component
 * @constructor
 * @demo star.js {UI展示}
 * @demo input.js {源码}
 * @show true
 * */

var CheckboxGroup = (function (_Component) {
    _inherits(CheckboxGroup, _Component);

    _createClass(CheckboxGroup, null, [{
        key: 'propTypes',
        value: {},
        enumerable: true
    }]);

    function CheckboxGroup(props, context) {
        _classCallCheck(this, CheckboxGroup);

        _Component.call(this, props, context);
    }

    CheckboxGroup.prototype.componentDidMount = function componentDidMount() {};

    CheckboxGroup.prototype.render = function render() {
        return _react2['default'].createElement(
            'div',
            { style: this.props.style,
                className: _classnames2['default'](this.getClassName('input-group'), this.props.className || '') },
            _react2['default'].createElement(
                'div',
                { className: this.getClassName('input-group-container') },
                this.props.children
            )
        );
    };

    return CheckboxGroup;
})(_utilsComponentJs2['default']);

exports['default'] = CheckboxGroup;
module.exports = exports['default'];