const fs = require('fs');
const path = require('path');
const {format} = require('date-fns');
const winston = require('winston');
const chalk = require('chalk');
const {updaters, selectors : $, state} = require('./state');
const bright = chalk.bold.white;

const colorize = (level, text) => {
	const colors = {
		error: chalk.bold.red,
		warn: chalk.bold.yellowBright,
		info: chalk.bold.blueBright,
		verbose: chalk.bold.green,
		debug: chalk.bold.yellow,
	};
	return (colors[level] || chalk.bold.white)(text);
};

class Logger {
	constructor() {
		
		const logDir = path.join(__dirname, '../logs');
		if (!fs.existsSync(logDir)) {
			fs.mkdirSync(logDir);
		}
		
		const logFile = path.join(logDir, `${format(Date.now(), 'YYYYMMDD_hhmmss')}.log`);
		
		
		const logTransports = {
			file: new (winston.transports.File)({filename: logFile, level: $.selectLoggerLevel() || 'verbose'}),
			console: new (winston.transports.Console)({
				level: 'debug', // immutable logging level
				timestamp: () => format(Date.now()),
				formatter: function (options) {
					const timestamp = bright(options.timestamp());
					const tag = colorize(options.level, options.meta.tag);
					const text = bright(options.message || '');
					return `${timestamp} - ${tag} ${text}`
				}
			})
		};
		
		this.logger = new (winston.Logger)({
			handleExceptions: true,
			humanReadableUnhandledException: true,
			transports: [
				logTransports.file,
				logTransports.console
			]
		});
		
		updaters.loggerUpdater({logFile});
		
		state.get(() => {
			const level = $.selectLoggerLevel();
			logTransports.file.level = level;
			this.logger.transports.file.silent = level === "off"
		})
	}
	
	log(level, message, meta) {
		this.logger.log(level, message, meta);
	}
}

module.exports = Logger;


