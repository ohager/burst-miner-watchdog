#!/usr/bin/env node
require('module-alias/register');
const args = require('args');

args.command("add", "Adds plugin to watchdog")
	.command("remove", "Adds plugin to watchdog");

const options = args.parse(process.argv, {version: false});

if(!args.sub.length){
	args.showHelp();
	process.exit(-1);
}

if(["add", "remove"].indexOf(args.sub[0]) === -1) {
	console.error("Unknown command: ", args.sub[0]);
	args.showHelp();
	process.exit(-1);
}
