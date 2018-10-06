#!/usr/bin/env node
require('module-alias/register');
const args = require('args');

args.command("add", "Adds plugin to watchdog")
	.command("remove", "Adds plugin to watchdog");

const options = args.parse(process.argv, {version: false});

console.log("watchdog-plugin", options);
