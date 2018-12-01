#!/usr/bin/env node
const args = require('args');
const {validateType} = require('./lib/argutils');
const simulateCommand = require('./plugin/simulate');

args.option("type", "The plugin type", "", validateType)
	.option("src", "The name of the folder where your plugin sources are located", "");

const options = args.parse(process.argv, {version: false});

(async function () {
	try {
		await simulateCommand(options);
		
	} catch (e) {
		console.error(e);
		process.exit(-1)
	}
})();

