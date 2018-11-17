const fs = require('fs-extra');
const {PluginTypes} = require('../../lib/constants');

const propertyExists = (obj, propertyName) => {
	const isValid = obj[propertyName] !== undefined;
	console.info(isValid ?
		`✔ - Property [${propertyName}] exists` :
		`🚫 - Property [${propertyName}] does not exist`);
	return isValid;
};

const hasRequiredProperties = (obj, properties) => properties.reduce(
	(prev, curr) => {
		return prev && propertyExists(obj, curr)
	},
	true);

const raiseInvalidError = () => {
	throw 'Validation failed. The plugin does not meet the requirements.';
};

const isProviderPlugin = (plugin) => hasRequiredProperties(plugin, ['name', 'provide']);

function validateHandler(plugin) {
	if(!hasRequiredProperties(plugin, ['name', 'onEvent'])) raiseInvalidError();
	
	console.info(`Handler Plugin '${plugin.name}' seems valid.`);
}

function validateExplorer(plugin) {
	if(isProviderPlugin(plugin)){
		console.info(`Explorer Plugin '${plugin.name}' seems valid.`);
	}
	else{
		raiseInvalidError();
	}
}

function validateMinerProcess(plugin) {
	if(isProviderPlugin(plugin)){
		const providedObj = plugin.provide();
		console.info('Validating provided object:');
		hasRequiredProperties(providedObj, ['isRunning', 'start', 'stop']);
		console.info(`Miner Process Plugin '${plugin.name}' seems valid.`);
	}
	else{
		raiseInvalidError();
	}
}

function validateMinerObservable(plugin) {
	if(isProviderPlugin(plugin)){
		const providedObj = plugin.provide();
		console.info('Validating provided object:');
		hasRequiredProperties(providedObj, ['blockEvents', 'errorEvents', 'closeEvents']);
		console.info(`Miner Observable Plugin '${plugin.name}' seems valid.`);
	}
	else{
		raiseInvalidError();
	}
}

const TypeValidators = {
	[PluginTypes.HANDLER]: validateHandler,
	[PluginTypes.EXPLORER]: validateExplorer,
	[PluginTypes.MINER_OBSERVABLE]: validateMinerObservable,
	[PluginTypes.MINER_PROCESS]: validateMinerProcess,
};

function validate(src, type) {
	
	console.info("Validating plugin");
	console.info("type:", type);
	console.info("path:", src);
	
	if (!fs.pathExistsSync(src)) {
		throw `Source Path could not be found:\n${src}`;
	}
	
	const pluginClass = require(src);
	TypeValidators[type](new pluginClass());
}

module.exports = validate;
