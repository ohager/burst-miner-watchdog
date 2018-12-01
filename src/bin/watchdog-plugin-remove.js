#!/usr/bin/env node
const args = require('args');
const {validateType} = require('./lib/argutils');
const removeCommand = require('./plugin/remove');

args.option("type", "The plugin type", "", validateType)
	.option("name", "The identifier/name of the plugin", "");

const options = args.parse(process.argv, {version: false});

(async function () {
	try {
		await removeCommand(options);
	}
	catch (e) {
		console.error(e);
		process.exit(-1);
	}
})();


