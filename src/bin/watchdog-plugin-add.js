#!/usr/bin/env node
require('module-alias/register');
const args = require('args');
const {required} = require('./lib/argutils');
const {PluginTypes} = require('./lib/constants');
const addCommand = require('./plugin/add');

const AllowedTypes = Object.keys(PluginTypes).map(key => PluginTypes[key])

function validateType(v) {
	if (AllowedTypes.indexOf(v) === -1) {
		console.error(`Unknown plugin type [${v}], allowed are:\n`);
		AllowedTypes.forEach(t => console.error(`\t- ${t}`));
		process.exit(-1);
	}
	return v;
}

args.option("type", "The plugin type", "handler", validateType)
	.option("name", "The identifier/name of the plugin", "myPlugin")
	.option("src", "The name of the folder where your plugin sources are located", "./");

const options = args.parse(process.argv, {version: false});

required(options, ["name", "src", "type"], () => {
	args.showHelp()
});

try {
	addCommand(options);
}
catch (e) {
	console.error(e);
	process.exit(-1);
}


