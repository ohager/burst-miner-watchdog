#!/usr/bin/env node
require('module-alias/register');
const args = require('args');
const {required} = require('./lib/argutils');
const addCommand = require('./plugin/add');

function validateType(v){
	const allowedTypes = ["handler", "explorer", "miner-process", "miner-observable"];
	if(allowedTypes.indexOf(v) === -1){
		console.error(`Unknown plugin type [${v}], allowed are:\n`);
		allowedTypes.forEach( t => console.error(`\t- ${t}`));
		process.exit(-1);
	}
	
	return v;
}

args.option("type", "The plugin type", "handler", validateType)
	.option("name", "The identifier/name of the plugin", "myPlugin")
	.option("src", "The name of the folder where your plugin sources are located", "./");

const options = args.parse(process.argv, {version: false});

required(options, ["name", "src", "type"], () => {args.showHelp()});

addCommand(options);

