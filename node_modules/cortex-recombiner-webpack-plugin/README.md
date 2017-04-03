# cortex-recombiner-webpack-plugin
a webpack plugin for recombine cortex package
####install

````
npm i cortex-recombiner-webpack-plugin
````

####webpack.config.js

````
var CortexRecombinerPlugin=require("cortex-recombiner-webpack-plugin");
module.exports = {
	entry:{
		...
	},
	...
	output:{
		...
	}
	...,
	
	plugins:[
		new CortexRecombinerPlugin({
			base:__dirname
		});
	]
}
````