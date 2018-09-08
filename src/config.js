const fs = require('fs');
const Ajv = require('ajv');
const chalk = require('chalk');
const {highlight} = require('cli-highlight');

function printError(brief, detail) {
	const red = chalk.bold.redBright;
	const yellow = chalk.bold.yellowBright;
	const white = chalk.bold.whiteBright;
	
	console.error(red("[ERROR]"));
	console.error(yellow(brief), '\n');
	console.error(white(detail), '\n\n');
	
	process.exit(-1);
}


const ajv = new Ajv({allErrors: true, jsonPointers: true});
require('ajv-errors')(ajv);

const configSchema = {
	required: ['logger', 'providers', 'failuresUntilGiveup'],
	properties: {
		failuresUntilGiveup: {
			type: 'number',
			minimum: 3,
			maximum: 50
		},
		logger: {
			type: 'object',
			required: ['enabled', 'level'],
			properties: {
				enabled: {
					type: 'boolean'
				},
				level: {
					enum: ['debug', 'verbose', 'info', 'warn', 'error']
				}
			}
		},
		plugins : {
			type: 'object',
			required: ['explorer', 'minerProcess', 'minerObservable'],
			
		},
	}
};

const validate = ajv.compile(configSchema);

function validateConfigJson(json) {
	const isValid = validate(json);
	if (!isValid) {
		printError('Validation for configuration failed!', highlight(JSON.stringify(validate.errors, null, 4)));
	}
}

function load(configFileName) {
	
	let configObj = null;
	try {
		configObj = JSON.parse(fs.readFileSync(configFileName, 'utf8'));
	}
	catch (e) {
		printError(`Could not load configuration ${configFileName}`, e);
		process.exit(-1);
	}
	
	validateConfigJson(configObj);
	
	return configObj;
	//updaters.configUpdater(configObj);
	
}

module.exports = {
	load
};
