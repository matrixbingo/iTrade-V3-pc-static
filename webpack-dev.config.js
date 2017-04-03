var config = require('./src/config/base.config');
var webpackConfig = require('./webpack.config');
var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var path = require('path');
var gutil = require("gulp-util");

module.exports= function(){

    var devPort = config.devPort;
    var wbpk = Object.create(webpackConfig);

    wbpk.devtool = 'eval';
    for (var key in wbpk.entry) {
        var ar = wbpk.entry[key];

        if (key != "common" && key!='dev') {
            ar.unshift('webpack-dev-server/client?http://127.0.0.1:' + devPort, "webpack/hot/dev-server");
        }
    }
    //wbpk.output.publicPath = './dist/';
    wbpk.plugins.push(
        new webpack.HotModuleReplacementPlugin()
    );
    wbpk.module.loaders=wbpk.module.loaders.filter(function(item){
        return item.test.toString().match(/less|css/i)==null;
    }).concat([
        {
            test: /\.(less$)$/,
            loader:"style!css!less"
            //loader: "style-loader!css-loader!less-loader"
        },
        {
            test: /\.css$/,
            loader: "style!css?-restructuring"
        },
        {
            test: /\.css\.module/,
            loader:   "style!css?-restructuring&modules&localIdentName=[local]___[hash:base64:5]"
        },
        {
            test: /\.less\.module/,
            loader:  "style!css?modules&localIdentName=[local]___[hash:base64:5]!less"

        },
        {
            test: /\.(jsx|es6)$/,
            loaders: ['react-hot', 'babel'],
            exclude: /node_modules/
        }
    ]);
    /*wbpk.module.loaders.push(
        {
            test: /\.(jsx|es6)$/,
            loaders: ['react-hot', 'babel'],
            exclude: /node_modules/
        }
    );*/
    var compiler = webpack(wbpk);

    new WebpackDevServer(compiler, {
        publicPath: '',
        contentBase: config.html,
        hot: true,
        historyApiFallback: true,
        port: devPort,
        stats: {
            colors: true
        }
    }).listen(devPort, "127.0.0.1", function (err) {
            if (err) throw new gutil.PluginError("webpack-dev-server", err);
            gutil.log("[webpack-dev-server]", "http://127.0.0.1:" + devPort +config.defaultStartPage );
        });
};
