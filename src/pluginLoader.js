const fs = require('fs');
const path = require('path');
const Plugin = require('./plugin');

function validatePlugin(plugin, file) {
	
	const isValid = plugin instanceof Plugin;
	if(!isValid)
	{
		console.error(`File '${file}' is not a valid Plugin`)
	}
	return isValid;
}

function load(dir){
	let plugins = [];
	
	fs.readdirSync(dir).forEach(file => {
		const PluginClass = require(path.join(dir, file));
		const plugin = new PluginClass();
		if(validatePlugin(plugin, file)){
			plugins.push(plugin);
			console.log('Found plugin' , plugin.name);
			
		}
	});
	
	return plugins;
}

module.exports = {
	load
};
