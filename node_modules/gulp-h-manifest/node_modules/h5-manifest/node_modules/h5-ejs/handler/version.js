var Tpl = require("../util/tpl");

module.exports = function(options,cb){
	cb(function(str){
		return Tpl.version
	});
}