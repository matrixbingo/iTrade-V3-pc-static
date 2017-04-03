var Tpl = require("../util/tpl");
var compiler = require("gulp-cortex-handlebars-compiler");
var cssTemplate = '<link rel="stylesheet" href="<%- value %>" >';
var EJS  = require("ejs");
var Tool = require("../util/tool");

module.exports = function(options,cb){
	var isCombo = options.combo || false;
	cb(!isCombo ? function(cssStr){
		var cssArr = cssStr.split(",");
		var result = [];

		cssArr.forEach(function(item){
			result.push(EJS.render(cssTemplate,{
				value:EJS.render(Tool.isRelative(item)?Tpl.static:Tpl.modfile,{
					value:item
				})
			}))
		})
		return result.join("\n");

	} : function(cssStr){
		return EJS.render(cssTemplate,{
			value:EJS.render(Tpl.combo,{
				value:cssStr
			})
		});
	})

}