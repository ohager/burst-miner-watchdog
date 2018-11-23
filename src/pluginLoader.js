const fs = require('fs');
const path = require('path');
const isEmpty = require('lodash/isEmpty');
const {writeInfo, writeWarning, writeSuccess, writeError} = require('@/utils');
const HandlerPlugin = require('@/plugins/handlerPlugin');
const ProviderPlugin = require('@/plugins/providerPlugin');

function isPath(pluginName){
	const parsed = path.parse(pluginName);
	return !(
		isEmpty(parsed.root) ||
		isEmpty(parsed.dir) ||
		isEmpty(parsed.ext)
	);
}

function isValidHandlerPlugin(plugin, file) {
	
	const isValid = plugin instanceof HandlerPlugin;
	if (!isValid) {
		writeError(`File '${file}' is not a valid HandlerPlugin`)
	}
	return isValid;
}

function loadHandlerPlugins(dir, handlers) {
	
	let plugins = [];
	let files = [];
	if(isEmpty(handlers)){
		files = fs.readdirSync(dir).map( f => path.join(dir, f) );
	}
	else {
		files = handlers.map( h => isPath(h) ? h : path.join(dir, `${h}.js`) )
	}
	
	files.forEach(file => {
		
		if(!fs.existsSync(file)){
			writeWarning(`Handler plugin ${file} not found and ignored. Check your config.json` );
			return;
		}
		
		const PluginClass = require(file);
		const plugin = new PluginClass();
		if (isValidHandlerPlugin(plugin, file)) {
			plugins.push(plugin);
			writeSuccess(`Loaded Handler Plugin: ${plugin.name}`, '[PLUGIN]');
		}
	});
	return plugins;
}

function assertValidProviderPlugin(plugin, file) {
	if (!(plugin instanceof ProviderPlugin)) {
		throw new Error(`File '${file}' is not a valid Provider Plugin`);
	}
}

function loadProviderPlugin(dir, file) {
	const pluginPath = isPath(file) ? file :  path.join(dir, file, 'index.js');

	if(!fs.existsSync(pluginPath)){
		throw new Error(`Handler plugin ${file} not found and ignored. Check your config.json` );
	}

	const PluginClass = require(pluginPath);
	const plugin = new PluginClass();
	assertValidProviderPlugin(plugin, file);
	
	writeSuccess(`Loaded Provider Plugin: ${plugin.name}`, '[PLUGIN]');
	return plugin;
}

function load(dir, config) {
	
	writeInfo("Loading plugins...");
	
	const handlerDir = path.join(dir, 'handler');
	const explorerProviderDir = path.join(dir, 'providers/explorer');
	const minerObservableProviderDir = path.join(dir, 'providers/miner/observable');
	const minerProcessProviderDir = path.join(dir, 'providers/miner/process');
	
	return {
		explorerProvider: loadProviderPlugin(explorerProviderDir, config.providers.explorer),
		minerObservableProvider: loadProviderPlugin(minerObservableProviderDir, config.providers.minerObservable),
		minerProcessProvider: loadProviderPlugin(minerProcessProviderDir, config.providers.minerProcess),
		handler: loadHandlerPlugins(handlerDir, config.handlers),
	};
}

module.exports = {
	load
};
