#!/usr/bin/env node
require('module-alias/register');
const args = require('args');

function pluginCommandCaller(name, sub, options){
	const command = require(`@/commands/plugin/${name}`);
	command.exec(sub, options)
}

function validateType(v){
	if(["handler", "explorer", "miner-process", "miner-observable"].indexOf(v) === -1){
		console.error(`Unknown plugin type [${v}]`);
		process.exit(-1);
	}
}

args.option("type", "The plugin type", "handler", validateType)
	.option("name", "The name of the plugin")
	.command("add", "Adds plugin to watchdog", pluginCommandCaller)
	.command("remove", "Adds plugin to watchdog", pluginCommandCaller);

args.parse(process.argv, {version: false});
