const chalk = require('chalk');
const {format} = require('date-fns');
const error = chalk.bold.red;
const bright = chalk.bold.white;
const success = chalk.keyword('green');
const info = chalk.bold.blueBright;
const warn = chalk.bold.yellowBright;

const timestamped = (tag) => `${bright(format(new Date()))} - ${tag}`;

function writeError(msg) {
	console.error(timestamped(error('[ERROR]')), bright(msg));
}

function writeSuccess(msg, tag = '[OK]') {
	console.log(timestamped(success(tag)), bright(msg));
}

function writeInfo(msg, tag = '[INFO]') {
	console.info(timestamped(info(tag)), bright(msg));
}

function writeWarning(msg, tag = '[WARN]') {
	console.info(timestamped(warn(tag)), bright(msg));
}

async function wait(timeout) {
	return new Promise(resolve => {
		setTimeout(resolve, timeout);
	});
}

module.exports = {
	writeError,
	writeSuccess,
	writeInfo,
	writeWarning,
	wait,
};
