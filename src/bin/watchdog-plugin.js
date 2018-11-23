#!/usr/bin/env node
require('module-alias/register');
const args = require('args');

args.command("add", "Adds plugin to watchdog (call watchdog-plugin-add --help if needed)")
	.command("list", "Adds plugin to watchdog (call watchdog-plugin-list --help if needed)")
	.command("remove", "Adds plugin to watchdog (call watchdog-plugin-remove --help if needed)")
	.command("create", "Creates a plugin stub for plugin development (call watchdog-plugin-create --help if needed)")
	.command("simulate", "Simulator for plugin developmente (call watchdog-plugin-simulate --help if needed)");

const options = args.parse(process.argv, {version: false});

if(!args.sub.length){
	args.showHelp();
	process.exit(-1);
}

if(["add", "remove", "list", "create", "simulate"].indexOf(args.sub[0]) === -1) {
	console.error("Unknown command: ", args.sub[0]);
	args.showHelp();
	process.exit(-1);
}
