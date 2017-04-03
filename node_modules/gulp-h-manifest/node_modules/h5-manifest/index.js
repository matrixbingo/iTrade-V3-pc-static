var fs = require("fs");
var makeArray = require("make-array");
var  argv =  process.argv;
var root_path = process.cwd();
var path =  require("path");
var combo = require("./lib/combo");
var nocombo = require("./lib/nocombo");
var H5Ejs = require("h5-ejs");
var isDev = !process.env.ENV || process.env.ENV == "dev";

function h5Manifest(fileStream,filePath,cb){

	var cssRxg = /\<\%\-\s*CSS\([\'\"]([\w\.\/\s\-\,]+)[\'\"]\)\s*\%\>/,
		jsRxg = /\<\%\-\s*JS\([\'\"]([\w\.\/\s\-\,]+)[\'\"]\)\s*\%\>/;

	var has_combo = cssRxg.test(fileStream) || jsRxg.test(fileStream);

	var data = has_combo ? combo(fileStream,filePath) : nocombo(fileStream,filePath);

	new H5Ejs(data,{
		combo:isDev ? false : true
	},function(content){
		cb(new Buffer(content));
	})

}

module.exports = h5Manifest