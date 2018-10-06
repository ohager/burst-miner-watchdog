#!/usr/bin/env node
require('module-alias/register');

const path = require('path');
const args = require('args');
const config = require('@/config');
const pluginLoader = require('@/pluginLoader');
const Backbone = require('@/backbone');

args.option("config", "The configuration file to be used", path.join(__dirname, "../../config.json"))
	.command("plugin", "Plugin managing command (call watchdog-plugin --help if needed)");

const options = args.parse(process.argv);

if (!args.sub.length) {
	const configuration = config.load(options.config);
	const plugins = pluginLoader.load(path.join(__dirname, '../plugins'), configuration);
	
	const backbone = new Backbone(plugins);
	backbone.run();
}








