const {state, selectors : $, updaters} = require('../state');
const {writeDebug, highlightJson} = require('../utils');

function printHelp() {
	const bright = chalk.bold.white;
	
	function writeKey(key, description) {
		console.log(`\t${bright(key)}\t- ${description}`);
	}
	
	writeDebug('Following keys are available:\n', '[HELP]');
	writeKey('c', 'Shows current configuration');
	writeKey('h', 'Prints this help');
	writeKey('l', 'Toggles through logger settings');
	writeKey('r', 'Restarts miner manually');
	writeKey('s', 'Show current state');
	writeKey('ESC or Ctrl-C', 'Exit');
	
	console.log('\n');
}

function printState() {
	let currentState = {...state.get()};
	delete currentState.config;
	writeDebug(`\n\n${highlightJson(currentState)}\n`, "[STATE]");
}

function printConfiguration() {
	writeDebug(`\n\n${highlightJson($.selectConfig())}\n`, "[CONFIG]");
}

function toggleLogger() {
	const level = $.selectLoggerLevel();
	const stages = ['off', 'debug', 'info', 'verbose', 'warn', 'error'];
	
	const index = stages.findIndex(stage => stage === level);
	const stage = stages[index === -1 ? 0 : (index + 1) % stages.length];
	
	const nextLoggerConfig = stage === 'off' ? {level: "off", enabled: false} : {level: stage, enabled: true};
	updaters.loggerUpdater(nextLoggerConfig);
	writeDebug(`\n${highlightJson($.selectLogger())}\n`, '[LOGGER]');
}


module.exports = {
	printState,
	printConfiguration,
	toggleLogger,
	printHelp
};
