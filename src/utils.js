const chalk = require('chalk');

const error = chalk.bold.red;
const highlight = chalk.bold.white;
const success = chalk.keyword('green');
const info = chalk.bold.blueBright;
const warn = chalk.bold.yellowBright;

function writeError(msg) {
	console.error(error('[ERROR]'), highlight(msg));
}

function writeSuccess(msg, tag = '[YAY]') {
	console.log(success(tag), highlight(msg));
}

function writeInfo(msg, tag = '[INFO]') {
	console.info(info(tag), highlight(msg));
}

function writeWarning(msg, tag = '[WARN]'){
	console.info(warn(tag), highlight(msg));
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
