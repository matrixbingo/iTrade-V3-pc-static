'use strict';

exports.__esModule = true;
var options = {
  /**
   * 项目名称
   * */
  moduleName: 'cat-browser',
  /**
   * cookie过期时间
   * */
  expiresTime: 1,
  /**
   * 点评id
   * */
  dpId: '',
  /**
   * 后端对应的url，默认dp，catjs报警接口
   * 不建议更改，因为字段需保持一致
   * */
  url: '//221.181.67.144/web-broker-service/api/js',
  /**
   * 可设置cookie名称和value，以判断是否符合规则的登录
   * 建议设置不易重复的值或者使用默认值
   * */
  cookieName: 'catBrowserName',
  cookieValue: 'catBrowserValue',
  /**
   * 是否只在dp环境下,才启用统计功能
   * 默认不加判断都可统计
   * */
  isOnlyDp: false
};
exports['default'] = options;
module.exports = exports['default'];