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

var _utilsClassNameMixinJs = require('../utils/ClassNameMixin.js');

var _utilsClassNameMixinJs2 = _interopRequireDefault(_utilsClassNameMixinJs);

/**
 * 封装Tr,Td组件，直接配合设置data属性的Table使用
 * @class Column
 * @module table(表格)
 * @constructor
 * @content {string} type 内容
 * @demo star.js {UI展示}
 * @demo table.js {源码}
 * @show true
 * */

var Column = (function (_Component) {
  _inherits(Column, _Component);

  function Column() {
    _classCallCheck(this, _Column);

    _Component.apply(this, arguments);
  }

  Column.prototype.render = function render() {
    return null;
  };

  _createClass(Column, null, [{
    key: 'propTypes',
    value: {
      /**
       * 表头样式(设置表头，支持JSX)
       * @property header
       * @type String
       * */
      header: _react.PropTypes.oneOfType([_react.PropTypes.node, _react.PropTypes.string]),
      /**
       * 用来声明需要绑定数组对象中的哪一个属性
       * @property field
       * @type String
       * */
      field: _react.PropTypes.string,
      /**
       * 用来描述每个竖排单元格的展示形式
       * 不应该为string
       * @property cell
       * @type Object
       * */
      cell: _react.PropTypes.object

    },
    enumerable: true
  }, {
    key: 'defaultProps',
    value: {},
    enumerable: true
  }]);

  var _Column = Column;
  Column = _utilsClassNameMixinJs2['default'](Column) || Column;
  return Column;
})(_react.Component);

exports['default'] = Column;
module.exports = exports['default'];