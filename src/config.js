const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const chalk = require('chalk');
const {highlight} = require('cli-highlight');
const state = require('./state');

function printError(brief, detail){
	const red = chalk.bold.redBright;
	const yellow = chalk.bold.yellowBright;
	const white = chalk.bold.whiteBright;
	
	console.error(red("[ERROR]"));
	console.error(yellow(brief),'\n');
	console.error(white(detail), '\n\n');
	
	process.exit(-1);
}


/**
 *   "miner": {
    "path": "C:\\Program Files\\creepMiner 1.8.0\\creepMiner.exe",
    "websocketUrl": "ws://localhost:8124/",
    "pingInterval": 300,
    "autoClose" : true
  },
 
 * @type {ajv | ajv.Ajv}
 */

const ajv = new Ajv({allErrors: true, jsonPointers: true});
require('ajv-errors')(ajv);


const configSchema = {
	required: ['logger','miner'],
	properties: {
		logger: {
			type: 'object',
			required: ['enabled','level'],
			properties: {
				enabled: {
					type: 'boolean'
				},
				level: {
					enum: ['debug', 'verbose', 'info', 'warn', 'error']
				}
			}
		},
		miner: {
			type: 'object',
			required: ['path','websocketUrl', 'pingInterval', 'autoClose'],
			properties: {
				path: {
					type: 'string'
				},
				websocketUrl: {
					type: 'string',
					format: 'uri',
					pattern: "^wss?:\/\/.+",
					errorMessage: 'Should be a valid websocket URL'
				},
				pingInterval: {
					type: 'number',
					minimum: 1,
					maximum: 15 * 60
				},
				autoClose :{
					type : 'boolean'
				}
			}
		},
		explorer: {
			type: 'object',
			required: ['pollInterval','apiUrl'],
			properties: {
				pollInterval: {
					type: 'number',
					minimum: 1,
					maximum: 2 * 60,
					errorMessage: 'The poll interval is measured in seconds'
				},
				apiUrl: {
					format: 'url',
					errorMessage: 'The root URL for the block explorer, i.e. the official PoCC API'
				}
			}
		},
		
	}
};

const validate = ajv.compile(configSchema);

function validateConfigJson(json){
	
	const isValid = validate(json);
	if (!isValid) {
		printError('Validation for configuration failed!', highlight(JSON.stringify(validate.errors, null, 4)));
	}
	
}

function validateConfigPaths(json){
	if(!fs.existsSync(json.miner.path)){
		printError('Invalid Path', `Could not find miner: ${json.miner.path}`);
		process.exit(-1);
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
	validateConfigPaths(configObj);
	
	state.updateConfig(configObj);
	
}

module.exports = {
	load
};
