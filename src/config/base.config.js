var package = require('../../package.json');

var ci = require('../../f2eci.json');

var devPort = '3006';

module.exports = {
  //静态页存储目录
  html:"./src/html",
  //本地调试端口
  devPort:devPort,
  //调试默认打开的页面
  defaultStartPage:'/config.html',
  //web or app
  projectType:'app',
  //生成目录
  "output": ci.dist,
  root:'src/entries',
  env:ci.env,
  //资源对应的不同环境域名
  cdn:ci.urlPrefix
};