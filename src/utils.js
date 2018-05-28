const chalk = require('chalk');
const {format} = require('date-fns');
const error = chalk.bold.red;
const highlight = chalk.bold.white;
const success = chalk.keyword('green');
const info = chalk.bold.blueBright;
const warn = chalk.bold.yellowBright;

const timestamped = (tag) => `${highlight(format(new Date()))} - ${tag}`;


function writeError(msg) {
	console.error(timestamped(error('[ERROR]')), highlight(msg));
}

function writeSuccess(msg, tag = '[OK]') {
	console.log(timestamped(success(tag)), highlight(msg));
}

function writeInfo(msg, tag = '[INFO]') {
	console.info(timestamped(info(tag)), highlight(msg));
}

function writeWarning(msg, tag = '[WARN]') {
	console.info(timestamped(warn(tag)), highlight(msg));
}

async function wait(timeout) {
	return new Promise(resolve => {
		setTimeout(resolve, timeout);
	});
}

async function waitFor(predicate, timeout) {
	return new Promise(resolve => {
		let started = Date.now();
		setTimeout(() => {
			if (predicate()) {
				resolve(true);
			}
			
			if (Date.now() - started >= timeout) {
				resolve(false);
			}
		}, 250);
	});
}


module.exports = {
	writeError,
	writeSuccess,
	writeInfo,
	writeWarning,
	wait,
	waitFor
};
