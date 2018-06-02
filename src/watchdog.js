const Rx = require('rxjs');
const chalk = require('chalk');
const {version, author} = require('../package.json');
const {filter, scan, map, pluck, distinctUntilChanged} = require('rxjs/operators');
const {highlight} = require('cli-highlight');

const BlockExplorer = require('./blockExplorer');
const MinerListener = require('./minerListener');
const MinerProcess = require('./minerProcess');
const KeyListener = require('./keyListener');
const SubscriptionManager = require('./subscriptionManager');

const {writeDebug, writeWarning, writeInfo, writeError, writeSuccess, wait} = require('./utils');
const state = require('./state');

const $fakeBlocks = Rx.Observable.interval(1000)
	.scan((acc, curr) => acc -= 500, 500000)
	.do(state.updateBlockFn('fake'));

function jsonString(jsonObj) {
	return highlight(JSON.stringify(jsonObj, null, 4), {language: 'json'});
}

function printHeader() {
	const bright = chalk.bold.white;
	const blue = chalk.bold.blueBright;
	const yellow = chalk.bold.yellowBright;
	
	console.log(blue(`-----------------------------------------------[${bright(version)}]---`));
	console.log(bright('                BURST Miner Watchdog 🐕'));
	console.log(yellow('\n         Keeps your miner running without pain'));
	console.log('\n');
	console.log(blue(`-----------------------------------------------[${bright(author.name)}]---`));
	console.log('\n');
	console.log('Press \'h\' for additional commands');
	console.log('\n');
}

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
	writeDebug(`\n\n${jsonString(currentState)}\n`, "[STATE]");
}

function printConfiguration() {
	writeDebug(`\n\n${jsonString(state.getConfig())}\n`, "[CONFIG]");
}

function toggleLogger() {
	const {level, enabled} = state.getConfig().logger;
	const stages = ['off', 'debug', 'info', 'verbose', 'warn', 'error'];
	
	const index = stages.findIndex(stage => stage === level);
	
	
	const stage = stages[index === -1 ? 0 : (index + 1) % stages.length];
	
	const nextLoggerConfig = stage === 'off' ? {level: "off", enabled: false} : {level: stage, enabled: true};
	console.log(index, nextLoggerConfig)
	state.updateLogger(nextLoggerConfig);
	writeDebug(`\n${jsonString(state.getConfig().logger)}\n`, '[LOGGER]');
}

class Watchdog {
	
	constructor() {
		
		this.__initialize = this.__initialize.bind(this);
		this.__handleBlockEvents = this.__handleBlockEvents.bind(this);
		this.__handleMinerErrors = this.__handleMinerErrors.bind(this);
		this.__exit = this.__exit.bind(this);
		this.__restartMiner = this.__restartMiner.bind(this);
		
		this.config = state.getConfig();
		this.subscriptions = new SubscriptionManager();
		this.minerProcess = new MinerProcess(this.config.miner.path, this.config.miner.pingInterval);
		this.blockExplorer = null;
		this.miner = null;
		
		const isKey = (k) => ({name}) => name === k;
		
		const keyListener = new KeyListener();
		this.$keys = keyListener.listen();
		this.$keys.filter(isKey('c')).subscribe(printConfiguration);
		this.$keys.filter(isKey('l')).subscribe(toggleLogger);
		this.$keys.filter(isKey('s')).subscribe(printState);
		this.$keys.filter(isKey('h')).subscribe(printHelp);
		this.$keys.filter(isKey('r')).subscribe(this.__restartMiner);
		
		this.$exitEvent = this.$keys.filter(({name, sequence}) => name === 'escape' || sequence === '\u0003');
		this.subscriptions.add('$exitEvent', this.$exitEvent.subscribe(this.__exit));
	}
	
	async __exit() {
		writeInfo("Exiting Watchdog...", "[BYE]");
		this.subscriptions.unsubscribeAll();
		await this.minerProcess.stop();
		process.exit(0);
	}
	
	async __initialize() {
		printHeader();
		writeInfo("Initializing Watchdog...");
		await this.minerProcess.start();
	}
	
	async __restartMiner() {
		writeInfo("Restarting Miner...");
		this.subscriptions.unsubscribe('$minerUnexpectedEvents', '$needRestartMinerEvent');
		await this.minerProcess.stop({killChildProcess: true});
		await this.minerProcess.start();
		state.updateRestart();
		await wait(2000);
		this.__handleBlockEvents();
	}
	
	__handleUnexpectedEvents() {
		const $minerCloseEvents = this.miner.closeEvents();
		const $minerErrorEvents = this.miner.errorEvents();
		
		const logCloseEvent = () => writeWarning(`${this.miner.connectionName} has closed connection...`);
		
		this.subscriptions.add('$minerUnexpectedEvents',
			$minerCloseEvents
				.do(logCloseEvent)
				.merge($minerErrorEvents.do(this.__handleMinerErrors))
				.takeUntil(this.$exitEvent)
				.subscribe(this.__restartMiner)
		);
	}
	
	__handleMinerErrors(e) {
		writeError(e.message);
		if(e.error.errno === 'ECONNREFUSED')
		{
			writeError('Cannot connect to miner. Check your configuration');
			this.__exit();
		}
	}
	
	__handleBlockEvents() {
		
		writeInfo("Start listening blocks");
		
		const {miner, explorer} = this.config;
		
		this.blockExplorer = new BlockExplorer(explorer.apiUrl, explorer.pollInterval);
		this.miner = new MinerListener(miner.websocketUrl);
		
		const $explorerBlockHeights = this.blockExplorer.lastBlocks().pluck('height').do(state.updateBlockFn('explorer'));
		const $minerBlockHeights = this.miner.blockheights().do(state.updateBlockFn('miner'));
		
		const blockString = e => `Blocks - Miner: ${e.miner}, Explorer: ${e.explorer}`;
		const logBlockEvent = e => writeSuccess(`${blockString(e)}`, '[✓]');
		const logBehindExplorer = e => writeWarning(`Miner Block is less than Explorer:\n${blockString(e)}`);
		
		const split = map(e => ({miner: e[0], explorer: e[1]}));
		const distinctHeightsOnly = distinctUntilChanged((p, q) => p.miner === q.miner && p.explorer === q.explorer);
		const isExplorerBeforeMiner = filter(h => h.explorer > h.miner);
		const purify = Rx.pipe(
			split,
			distinctHeightsOnly,
		);
		
		const $needRestartMinerEvent = $minerBlockHeights
			.combineLatest($explorerBlockHeights)
			.takeUntil(this.$exitEvent)
			.let(purify)
			.do(logBlockEvent)
			.let(isExplorerBeforeMiner);
		
		this.subscriptions.add('$needRestartMinerEvent',
			$needRestartMinerEvent.do(logBehindExplorer).subscribe(this.__restartMiner)
		);
		
		this.__handleUnexpectedEvents();
	}
	
	async run() {
		await this.__initialize();
		await wait(2000);
		this.__handleBlockEvents();
	}
}

module.exports = Watchdog;
