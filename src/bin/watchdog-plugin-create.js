#!/usr/bin/env node
require('module-alias/register');
const args = require('args');
const {required, validateType} = require('./lib/argutils');
const createCommand = require('./plugin/create/create');

args.option("type", "The plugin type", "handler", validateType)
	.option("name", "The identifier/name of the plugin");

const options = args.parse(process.argv, {version: false});

required(options, ["name", "type"], () => {
	args.showHelp()
});

try {
	createCommand(options);
}
catch (e) {
	console.error(e);
	process.exit(-1);
}


