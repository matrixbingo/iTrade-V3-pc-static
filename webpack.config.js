var webpack = require('webpack');
var path = require('path');
var glob = require('glob');
var extend = require('extend');
var entry = require('./src/config/vendor');
var externals = require('./src/config/externals');
var config = require('./src/config/base.config');
var alias = require('./src/config/alias.json');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CortexRecombinerPlugin=require('cortex-recombiner-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var setExternals= function() {
   /* var external=externals;

    return external;*/
};

//var baseFileDir = path.join(process.cwd(), 'src/');
var htmlPlugin=[];
var getEntry = function(){
    var webpackConfigEntry = {};
    if(config.root.indexOf('.') !=-1 ){
        webpackConfigEntry.bundle=[path.join(__dirname, config.root)];
    }else{
        var basedir =path.join(process.cwd(), config.root);
        var files = glob.sync(path.join(basedir, '*.jsx'));

        files.forEach(function(file) {
            var relativePath = path.relative(basedir, file);
            generateHtml(relativePath.replace(/\.jsx/,'').toLowerCase() );
            webpackConfigEntry[relativePath.replace(/\.jsx/,'').toLowerCase()] = [file];
        });
    }

    return webpackConfigEntry;
};

function generateHtml(htmlName){
    //var path = config.html+'/'+htmlName+'.html';
    htmlPlugin.push(
        new HtmlWebpackPlugin({
            title: htmlName,
            template: path.resolve(config.html, 'dev.html'),
            filename: htmlName+'.html',
            chunks: ['common', htmlName],
            inject: 'body'
        })

    );
}


function setCommonsChuck(){
    var arr=[];
    for(var item in entry){
        arr.push(item);
    }
    return arr;
}

var webpackConfig = {
    entry: extend(getEntry(),entry||{}),
    output: {
        path:path.join(__dirname, config.output.replace('./','') ),
        filename: '[name].js',
        libraryTarget: "umd",
        publicPath: config.cdn,
        chunkFilename: '[name].[chunkhash].js',
        sourceMapFilename: '[name].map'
    },
    cache: true,
    devtool: 'source-map',
    externals:setExternals(),
    resolve: {
        extensions: ['', '.js'],
        alias:extend({},alias ||{})
    },
    module: {
        loaders: [
            {
                test: /\.(jsx|es6)$/,
                loaders: ['babel'],
                exclude: /node_modules/
            },
            {
                test: /\.(less$)$/,
                loader: ExtractTextPlugin.extract("css!postcss!less")
                //loader: "style-loader!css-loader!less-loader"
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('css?-restructuring!postcss')
            },
            {
                test: /\.css\.module/,
                loader:  ExtractTextPlugin.extract('css?-restructuring&modules&localIdentName=[local]___[hash:base64:5]!postcss')
            },
            {
                test: /\.less\.module/,
                loader:  ExtractTextPlugin.extract('css?modules&localIdentName=[local]___[hash:base64:5]!postcss!less')

            },
            {
                test: /\.svg$/,
                loader: "url-loader?limit=10000&mimetype=image/svg+xml"
            },
            {
                test: /\.woff|ttf|woff2|eot$/,
                loader: 'url?limit=100000'
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    'url?limit=35000'/*,
                    'image-webpack?progressive&optimizationLevel=3&interlaced=false'*/
                ]
            },
            {
                test: /\.html$/,
                loader: "handlebars-loader"
            }
        ]
    },
    /*postcss: [
        require('autoprefixer'),
        require('postcss-color-rebeccapurple')
    ],*/

    plugins: [
        //new webpack.optimize.UglifyJsPlugin(),
        new ExtractTextPlugin("[name].css", {
            disable: false,
            allChunks: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            //name: "common",
            //filename: "common.js",
            names: setCommonsChuck(),
            minChunks: Infinity

        }),
        new CortexRecombinerPlugin({
            base:__dirname//path.resolve(__dirname,relativeToRootPath),//项目根目录的绝对路径
        })/*,
        new webpack.optimize.DedupePlugin()*/
    ]
};

console.log(config.env);

if(config.env!='beta'&& config.env!='dev'){
    console.log('..........----pro----.............');
    webpackConfig.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    );
    webpackConfig.plugins.push(
        new webpack.DefinePlugin({
            'process.env':{
                'NODE_ENV': JSON.stringify('production')
            }
        })
    );
    webpackConfig.plugins.push(
        new webpack.optimize.DedupePlugin()
    );
}

module.exports = webpackConfig;
