const path = require('path');
const {spawn} = require('child_process');
const fs = require('fs-extra');
const inquirer = require('inquirer');
const isEmpty = require('lodash/isEmpty');
const {PluginTypes} = require('../../lib/constants');

const getTypeNames = () => Object.keys(PluginTypes).map(k => PluginTypes[k]);

const exep = (cmd, args, opts) => new Promise((resolve, reject) => {
	console.log(`Executing ${cmd} ${args.join(" ")}`);
	const process = spawn(cmd, args, opts);
	process.on('close', (code) => {
		if (code !== 0) {
			reject("Ooops, something failed");
		}
		else {
			resolve();
		}
	})
});

function createConfigurationFile(type, src){
	let simulationConfig = fs.readJsonSync(path.join(__dirname, './simulate.base.config.json'));
	const absoluteSrcPath = path.join(process.cwd(), src);
	switch(type){
		case PluginTypes.HANDLER:
			simulationConfig.handlers = [absoluteSrcPath];
			break;
		case PluginTypes.EXPLORER:
			simulationConfig.providers.explorer = absoluteSrcPath;
			break;
		case PluginTypes.MINER_PROCESS:
			simulationConfig.providers.minerProcess = absoluteSrcPath;
			break;
		case PluginTypes.MINER_OBSERVABLE:
			simulationConfig.providers.minerObservable = absoluteSrcPath;
			break;
	}
	
	const simulationConfigFile = path.join(__dirname, './simulate.config.json');
	fs.writeJsonSync(simulationConfigFile, simulationConfig);
	return simulationConfigFile;
}

const runWatchdog = function ({type, src}) {
	const watchdogPath = path.join(__dirname, '../../watchdog.js');
	const configFile = createConfigurationFile(type, src);
	return exep('node', [
			watchdogPath,
			`--config ${configFile}`
		],
		{stdio: 'inherit'})
};

async function simulate(opts) {
	
	const answers = await inquirer.prompt([
		{
			type: 'list',
			name: 'type',
			message: 'What type of plugin do you want to add?',
			choices: getTypeNames(),
			default: PluginTypes.HANDLER,
			when: () => isEmpty(opts.type),
		},
		{
			type: 'input',
			name: 'src',
			message: 'Where is your source located?',
			default: './',
			when: () => isEmpty(opts.src),
		},
	]);
	
	runWatchdog({
		...opts,
		...answers
	});
	
}

module.exports = simulate;
