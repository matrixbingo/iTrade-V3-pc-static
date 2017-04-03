var fs = require("fs");
var makeArray = require("make-array");
var  argv =  process.argv;
var root_path = process.cwd();
var path =  require("path");


function manifest(fileStream,filePath){

	var cssRxg = /\<\%\-\s*CSS\([\'\"]([\w\.\/\s\-\,]+)[\'\"]\)\s*\%\>/,
		jsRxg = /\<\%\-\s*JS\([\'\"]([\w\.\/\s\-\,]+)[\'\"]\)\s*\%\>/;

	var data = "CACHE MANIFEST\n";

	var js = pathFuc({
		type: "js",
		rxg: jsRxg,
		stream: fileStream
	})

	var css = pathFuc({
		type: "css",
		rxg: cssRxg,
		stream: fileStream
	});

	var img = imgpath(fileStream,cssRxg);

	var html = makeHtmlArr(filePath);

	var dep_js = readJson();

	var maps = concatArr(css, js, img, html,dep_js);

	maps.forEach(function(item){
		data += item + "\n";
	})

	data += "NETWORK:\n*\n";

	return data;

};

function readJson() {

	var cortex_arr = [];
	var cortex_json = JSON.parse(fs.readFileSync(root_path+"/cortex.json","utf-8"));
	var module_arr = cortex_json.combo && cortex_json.combo.filter;
	if(module_arr){
		for(var i = 0; i < module_arr.length; i++){

			cortex_arr.push("{{{modfile '" + module_arr[i] + "'}}}");

		}
	}

	return cortex_arr;

}

function pathFuc(object){

	var path_str = object.stream.match(object.rxg) && object.stream.match(object.rxg)[1];

	var path_name = object.type.toUpperCase() + "_PATH";

	return path_str ? '<%-' + path_name + '("' + path_str + '") %>' : "";

}

function imgpath(stream,cssRxg){

	var img_str_arr = [];

	if(!stream.match(cssRxg)){
		return;
	}

	var path_str = stream.match(cssRxg)[1];

	var css_path_arr = path_str.split(",");

	var cssRxg = /^(\.{1,3}\/)+[\w\/\-]+/g;

	var css_in_file;

	css_path_arr.forEach(function(item){
		if(cssRxg.test(item)){
			css_in_file = item;
			return;
		}
	});

	css_in_file && readImg4Css(css_in_file) && readImg4Css(css_in_file).forEach(function(item){
													img_str_arr.push("{{{static '" + item + "'}}}");
												})

	return img_str_arr;

}

function readImg4Css(path_str){

	var bgHrefRxg = /url\([\'\"]?([\w\.\/\s\-]+)[\'\"]?\)/g,
		bgSrcRxg = /url\([\'\"]?([\w\.\/\s\-]+)[\'\"]?\)/;

	var path_arr = path_str.split("/"),
		css_link = "", img_arr = [];

	for(var i = 0; i< path_arr.length; i++){
		if(path_arr[i] != ".."){
			css_link += "/" + path_arr[i];
		}
	}

	css_link = root_path + css_link;

	var css_stream = fs.readFileSync(css_link,"utf-8");

	var img_src_arr = css_stream.match(bgHrefRxg);

	makeArray(img_src_arr).forEach(function(item){

		var src_path = bgSrcRxg.exec(item)[1];

		var img_src = transformImgPath(src_path, path_arr,img_arr);

		img_src && img_arr.push(img_src);
			
	})

	if(img_arr.length){
		return img_arr;
	}

}

function transformImgPath(img_path, css_path, arr){

	var img_path_arr = img_path.split("/");

	if(img_path_arr[0] !== ".."){

		if(img_path_arr[1] == ".."){
			var css_arr = [],img_arr = [];

			img_path_arr.splice(0, 1);

			for(var i = css_path.length; i > 0; i--){

				if(!/^([\w\/\s\-]+)\.css$/.test(css_path[i - 1])){
					cssArr.push(css_path[i - 1]);
				}

			}

			for(var i = 0; i < img_path_arr.length; i++){
				if(img_path_arr[0] == ".."){
					css_arr.splice(0, 1);
					img_path_arr.splice(0,1);
				}

			}

			img_arr = concatArr(css_arr.reverse(), img_path_arr);


			var result = img_arr.join("/");

			if(result && arr.indexOf(result) == -1){
				return result;
			}

		}else{
			img_path_arr[0] == "." ? img_path_arr.splice(0,1) : function() {};

			for(var i = css_path.length ; i > 0; i--){

				if(!/^([\w\/\s\-]+)\.css$/.test(css_path[i - 1])){
					img_path_arr.splice(0,0,css_path[i - 1]);
				}
			}

			var result = img_path_arr.join("/");

			if(result && arr.indexOf(result) == -1){
				return result;
			}
		}

	}else{

		var css_arr = [],img_arr = [];

		for(var i = css_path.length; i > 0; i--){

			if(!/^([\w\/\s\-]+)\.css$/.test(css_path[i - 1])){
				css_arr.push(css_path[i - 1]);
			}

		}

		for(var i = 0; i < img_path_arr.length; i++){
			if(img_path_arr[0] == ".."){
				css_arr.splice(0, 1);
				img_path_arr.splice(0,1);
			}

		}

		img_arr = concatArr(css_arr.reverse(), img_path_arr);

		var result = img_arr.join("/");

		if(result && arr.indexOf(result) == -1){
			return result;
		}

	}

}

function concatArr(){
	var arr = [];
	for(var i = 0 ;i < arguments.length; i++){
		if(arguments[i]){
			arr = arr.concat(arguments[i]);
		}
	}

	return arr;

}

function makeHtmlArr(path_name){
	var arr = [];
	var html_str = "./"+path.basename(path_name);
	arr.push(autoUpdate(html_str));
	return arr;
}

function autoUpdate(str){
	return str+"?"+new Date().getTime();
}

module.exports = manifest
