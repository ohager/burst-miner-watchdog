#!/usr/bin/env node
const args = require('args');
const {validateType} = require('./lib/argutils');
const createCommand = require('./plugin/create/create');

args.option("type", "The plugin type", "", validateType)
	.option("name", "The identifier/name of the plugin", "");

const options = args.parse(process.argv, {version: false});

(async function() {
	try {
		await createCommand(options);
	}
	catch (e) {
		console.error(e);
		process.exit(-1);
	}
})();


