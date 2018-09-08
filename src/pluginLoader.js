const fs = require('fs');
const path = require('path');
const HandlerPlugin = require('./plugins/handlerPlugin');
const ProviderPlugin = require('./plugins/providerPlugin');

function isValidHandlerPlugin(plugin, file) {
	
	const isValid = plugin instanceof HandlerPlugin;
	if (!isValid) {
		console.error(`File '${file}' is not a valid HandlerPlugin`)
	}
	return isValid;
}

function loadHandlerPlugins(dir) {
	let plugins = [];
	fs.readdirSync(dir).forEach(file => {
		const PluginClass = require(path.join(dir, file));
		const plugin = new PluginClass();
		if (isValidHandlerPlugin(plugin, file)) {
			plugins.push(plugin);
			console.log('Found Handler Plugin', plugin.name);
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
	const PluginClass = require(path.join(dir, file, 'index.js'));
	const plugin = new PluginClass();
	assertValidProviderPlugin(plugin, file);
	
	console.log('Found Provider Plugin', plugin.name);
	return plugin;
}

function load(dir, config) {
	
	const handlerDir = path.join(dir, 'handler');
	const explorerProviderDir = path.join(dir, 'providers/explorer');
	const minerObservableProviderDir = path.join(dir, 'providers/miner/observable');
	const minerProcessProviderDir = path.join(dir, 'providers/miner/process');
	
	return {
		explorerProvider: loadProviderPlugin(explorerProviderDir, config.providers.explorer),
		minerObservableProvider: loadProviderPlugin(minerObservableProviderDir, config.providers.minerObservable),
		minerProcessProvider: loadProviderPlugin(minerProcessProviderDir, config.providers.minerProcess),
		handler: loadHandlerPlugins(handlerDir),
	};
}

module.exports = {
	load
};
