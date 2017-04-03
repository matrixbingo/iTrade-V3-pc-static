var ciconfig = require('dpciconfig');

var DEFAULT = {
	combo:false,
	cwd:process.env.WORKSPACE || process.cwd(),
	host:ciconfig["host"],
  	mod_root: "/mod",
  	template_dir: "handlerbar"
}

module.exports = function(){
	 return DEFAULT;
}