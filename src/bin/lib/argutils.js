const isEmpty = require('lodash/isEmpty');
const {PluginTypes} = require('./constants');

const AllowedTypes = Object.keys(PluginTypes).map(key => PluginTypes[key]);

function validateType(v) {
	
	if(!v || v==='') return v;
	
	if (AllowedTypes.indexOf(v) === -1) {
		console.error(`Unknown plugin type [${v}], allowed are:\n`);
		AllowedTypes.forEach(t => console.error(`\t- ${t}`));
		process.exit(-1);
	}
	return v;
}

const required = (options, requiredArgs, invalidCallback = () => {}) => {
	let isValid = true;
	requiredArgs.forEach(a => {
		if (isEmpty(options[a])) {
			console.error(`\n[${a}] is mandatory\n`);
			isValid = false;
		}
	});
	
	if (!isValid) {
		invalidCallback();
	}
};

module.exports = {
	required,
	validateType
};
