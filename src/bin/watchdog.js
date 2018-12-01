#!/usr/bin/env node

const path = require('path');
const args = require('args');
const chalk = require('chalk');
const config = require('../config');
const {isDevelopmentMode,writeError} = require('../utils');
const pluginLoader = require('../pluginLoader');
const Backbone = require('../backbone');
const {version, author} = require('../../package.json');

args.option("config", "The configuration file to be used", path.join(__dirname, "../../config.json"))
	.command("plugin", "Plugin managing command (call watchdog-plugin --help if needed)");

const options = args.parse(process.argv);

function printHeader() {
	const bright = chalk.bold.white;
	const blue = chalk.bold.blueBright;
	const yellow = chalk.bold.yellowBright;
	
	console.log(blue(`-----------------------------------------------[${bright(version)}]---`));
	console.log(bright('                BURST Miner Watchdog 🐕'));
	console.log(yellow('\n         Keeps your miner running without pain'));
	if (isDevelopmentMode()) {
		console.log(bright('\n                  *DEVELOPMENT MODE*'));
	}
	console.log('\n');
	console.log(blue(`-----------------------------------------------[${bright(author.name)}]---`));
	console.log('\n');
	console.log('Press \'h\' for additional commands');
	console.log('\n');
	
}

printHeader();

if (!args.sub.length) {
	try {
		const configuration = config.load(options.config);
		const plugins = pluginLoader.load(path.join(__dirname, '../plugins'), configuration);
		const backbone = new Backbone(plugins);
		backbone.run();
		
	} catch (e) {
		writeError(e);
		process.exit(-1);
	}
	
}








