const chalk = require('chalk');
const {state} = require('@/state');
const $ = require('@/state/selectors');
const {loggerUpdater} = require('@/state/updaters');
const {writeDebug, highlightJson} = require('@/utils');

const bright = chalk.bold.white;

function writeKey(key, description) {
	console.log(`\t${bright(key)}\t- ${description}`);
}

function printHelp(keymap, context = ""){
	
	writeDebug('Following keys are available:\n', '[HELP]');

	if(context.length > 0){
		console.log(`For ${context}\n`);
	}
	
	Object.keys(keymap).forEach( k => {
		writeKey(k, keymap[k]);
	});
	
	console.log('\n');
}

function printState() {
	let currentState = {...state.get()};
	delete currentState.config;
	try{
	
	writeDebug(`\n\n${highlightJson(currentState)}\n`, "[STATE]");
	}catch(e){
		console.error(e);
	}
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
	loggerUpdater(nextLoggerConfig);
	writeDebug(`\n${highlightJson($.selectLogger())}\n`, '[LOGGER]');
}


module.exports = {
	printState,
	printConfiguration,
	toggleLogger,
	printHelp
};
