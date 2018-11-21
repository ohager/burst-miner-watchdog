#!/usr/bin/env node
require('module-alias/register');
const args = require('args');
const {validateType} = require('./lib/argutils');
const addCommand = require('./plugin/add');

args.option("type", "The plugin type", '', validateType)
	.option("name", "The identifier/name of the plugin", '')
	.option("src", "The name of the folder where your plugin sources are located", '');

const options = args.parse(process.argv, {version: false});

(async function () {
	try {
		await addCommand(options);
	}
	catch (e) {
		console.error(e);
		process.exit(-1);
	}
})();


