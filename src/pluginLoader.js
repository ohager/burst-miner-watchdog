const fs = require('fs');
const path = require('path');
const isEmpty = require('lodash/isEmpty');
const {writeInfo, writeWarning, writeSuccess, writeError} = require('@/utils');
const HandlerPlugin = require('@/plugins/handlerPlugin');
const ProviderPlugin = require('@/plugins/providerPlugin');

function getPluginPath(pluginReference, dir) {
	let pluginPath = null;
	
	if (fs.existsSync(pluginReference)) {
		const isDir = fs.statSync(pluginReference).isDirectory();
		pluginPath = isDir ? path.join(pluginReference, 'index.js') : pluginReference;
	}
	else{
		pluginPath = path.join(dir, pluginReference, 'index.js')
	}
	
	console.log("getPluginPath", pluginPath);
	
	return pluginPath;
}


function isValidHandlerPlugin(plugin, file) {
	
	const isValid = plugin.onEvent && plugin.name;
	if (!isValid) {
		writeError(`File '${file}' is not a valid HandlerPlugin`)
	}
	return isValid;
}

function loadHandlerPlugins(dir, handlers) {
	
	let plugins = [];
	let files = [];
	if (isEmpty(handlers)) {
		files = fs.readdirSync(dir).map(f => path.join(dir, f));
	}
	else {
		files = handlers.map(getPluginPath)
	}
	
	files.forEach(file => {
		
		if (!fs.existsSync(file)) {
			writeWarning(`Handler plugin ${file} not found and ignored. Check your config.json`);
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
	const pluginPath = getPluginPath(file, dir);
	
	if (!fs.existsSync(pluginPath)) {
		throw new Error(`Provider plugin ${file} not found. Check your config.json`);
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
