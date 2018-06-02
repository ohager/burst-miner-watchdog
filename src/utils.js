const Logger = require('./logger');

let logger = null;

function log(level, msg, tag) {
	
	//lazy instantiation
	if (!logger) {
		logger = new Logger();
	}
	
	logger.log(level, msg, {tag});
}

function writeError(msg) {
	log('error', msg, '[ERROR]');
}

function writeSuccess(msg, tag = '[OK]') {
	log('verbose', msg, tag);
}

function writeInfo(msg, tag = '[INFO]') {
	log('info', msg, tag);
}

function writeWarning(msg, tag = '[WARN]') {
	log('warn', msg, tag);
}

function writeDebug(msg, tag = '[DEBUG]') {
	log('debug', msg, tag);
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
	writeDebug,
	wait,
	
};
