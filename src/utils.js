const {highlight} = require('cli-highlight');
const Logger = require('./logger');

let logger = null;

function highlightJson(jsonObj) {
	return highlight(JSON.stringify(jsonObj, null, 4), {language: 'json'});
}

function log(level, msg, tag) {
	//lazy instantiation
	if (!logger) {
		logger = new Logger();
	}
	
	try {
		logger.log(level, msg, {tag});
	}catch(e){
		console.error(e)
	}
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

function isDevelopmentMode(){
	return process.env.NODE_ENV === 'development'
}

async function wait(timeout) {
	return new Promise(resolve => {
		setTimeout(resolve, timeout);
	});
}


module.exports = {
	highlightJson,
	writeError,
	writeSuccess,
	writeInfo,
	writeWarning,
	writeDebug,
	wait,
	isDevelopmentMode
};
