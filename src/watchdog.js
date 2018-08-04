const chalk = require('chalk');
const {version, author} = require('../package.json');
const {isDevelopmentMode} = require('./utils');
const {selectors: $, updaters} = require('./state');

const keyEffects = require('@streams/effects/keys');
const blockEffects = require('@streams/effects/blocks');
const errorEffects = require('@streams/effects/errors');
const blockOperations = require('@streams/operations/blocks');
const errorOperations = require('@streams/operations/errors');
const keyOperations = require('@streams/operations/keys');

const {writeWarning, writeInfo, writeError, writeSuccess, wait} = require('./utils');

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


const PRINT_CONFIG = 'c';
const PRINT_HELP = 'h';
const TOGGLE_LOGGER = 'l';
const RESTART_MINER = 'r';
const SHOW_STATE = 's';

const keyMap = {
	[PRINT_CONFIG]: 'Shows current configuration',
	[PRINT_HELP]: 'Prints this help',
	[TOGGLE_LOGGER]: 'Toggles through logger settings',
	[RESTART_MINER]: 'Toggles through logger settings',
	[SHOW_STATE]: 'Toggles through logger settings',
	'ESC, CTRL-C' : 'Exit'
};

class Watchdog {
	
	constructor({keysProvider, minerBlocksProvider, explorerBlocksProvider, minerProcessProvider}) {
		
		this.__initialize = this.__initialize.bind(this);
		this.__handleEvents = this.__handleEvents.bind(this);
		this.__exit = this.__exit.bind(this);
		this.__restartMiner = this.__restartMiner.bind(this);
		
		const {forKey} = keyOperations;
		this.key$ = keysProvider();
		
		this.key$
			.do(forKey(PRINT_CONFIG)(keyEffects.printConfiguration))
			.do(forKey(TOGGLE_LOGGER)(keyEffects.toggleLogger))
			.do(forKey(SHOW_STATE)(keyEffects.printState))
			.do(forKey(PRINT_HELP)(() => keyEffects.printHelp(keyMap)))
			.do(forKey(RESTART_MINER)(this.__restartMiner, this))
			.subscribe();
		
		this.config = $.selectConfig();
		
		this.minerProcess = minerProcessProvider(this.config.miner.path, this.config.miner.pingInterval);
		this.explorerBlocksProvider = explorerBlocksProvider;
		this.minerBlocksProvider = minerBlocksProvider;
		
	}
	
	async __initialize() {
		printHeader();
		writeInfo("Initializing Watchdog...");
		await this.minerProcess.start();
	}
	
	async __exit() {
		writeInfo("Exiting Watchdog...", "[BYE]");
		await this.minerProcess.stop({killChildProcess: $.selectIsAutoClose()});
		process.exit(0);
	}
	
	async __restartMiner() {
		this.restartSubscription.unsubscribe();
		writeInfo("Restarting Miner...");
		updaters.restartUpdater();
		await this.minerProcess.stop({killChildProcess: true});
		await this.minerProcess.start();
		await wait(2000);
		this.__handleEvents();
	}
	
	__handleEvents() {
		
		writeInfo("Start listening blocks");
		
		const {miner, explorer} = this.config;
		
		const {block$, error$, close$} = this.minerBlocksProvider(miner.websocketUrl);
		const explorerBlocks = this.explorerBlocksProvider(explorer.apiUrl, explorer.pollInterval);
		const {logError} = errorEffects;
		
		const {exitKey} = keyOperations;
		const {connectionError} = errorOperations;
		const {purify, isExplorerBeforeMiner} = blockOperations;
		const {logBlockEvent, logBehindExplorer, logCloseEvent, updateMinerBlockState, updateExplorerBlockState} = blockEffects;
		
		const explorerBlockHeight$ = explorerBlocks.pluck('height').do(updateExplorerBlockState);
		const minerBlockHeight$ = block$.do(updateMinerBlockState);
		const minerClose$ = close$.do(logCloseEvent);
		const minerError$ = error$.do(logError);
		const exitRequest$ = this.key$.let(exitKey).do(this.__exit);
		
		const requireRestart$ = minerBlockHeight$
			.combineLatest(explorerBlockHeight$)
			.takeUntil(exitRequest$)
			.subscribe(console.log)
			/*
			.let(purify)
			.do(logBlockEvent)
			.let(isExplorerBeforeMiner)
			.do(logBehindExplorer);
		
		
		
		
		const minerConnectionError$ = minerError$
			.let(connectionError);
		
		const exit$ = minerConnectionError$
			.merge(exitRequest$, requireRestart$)
			.do(this.__exit)
			.first();
		
		this.restartSubscription = minerClose$
			.merge(minerError$, requireRestart$)
			.takeUntil(exit$)
			.subscribe(this.__restartMiner);
			*/
	}
	
	async run() {
		await this.__initialize();
		await wait(3000);
		this.__handleEvents();
	}
}

module.exports = Watchdog;
