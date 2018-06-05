const Rx = require('rxjs');
const chalk = require('chalk');
const {version, author} = require('../package.json');

const {selectors: $, updaters} = require('./state');

const keyEffects = require('./effects/keys');
const blockEffects = require('./effects/blocks');
const errorEffects = require('./effects/errors');
const blockOperations = require('./operations/blocks');
const errorOperations = require('./operations/errors');
const keyOperations = require('./operations/keys');


const {writeWarning, writeInfo, writeError, writeSuccess, wait} = require('./utils');

const $fakeBlocks = Rx.Observable.interval(500)
	.scan((acc, curr) => acc -= 500, 500000)
	.do(updaters.createBlockUpdater('fake'));


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


class Watchdog {
	
	constructor({keysProvider, minerBlocksProvider, explorerBlocksProvider, minerProcessProvider}) {
		
		const b = (fn) => {
			fn = fn.bind(this);
		};
		
		this.__initialize = this.__initialize.bind(this);
		this.__handleEvents = this.__handleEvents.bind(this);
		this.__exit = this.__exit.bind(this);
		this.__restartMiner = this.__restartMiner.bind(this);
		
		const {key} = keyOperations;
		this.key$ = keysProvider();
		this.key$.let(key('c')).subscribe(keyEffects.printConfiguration);
		this.key$.let(key('l')).subscribe(keyEffects.toggleLogger);
		this.key$.let(key('s')).subscribe(keyEffects.printState);
		this.key$.let(key('h')).subscribe(keyEffects.printHelp);
		this.key$.let(key('r')).subscribe(this.__restartMiner);

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
		this.subscriptions.unsubscribeAll();
		await this.minerProcess.stop({killChildProcess: $.selectIsAutoClose()});
		process.exit(0);
	}
	
	async __restartMiner() {
		writeInfo("Restarting Miner...");
		updaters.restartUpdater();
		await this.minerProcess.stop({killChildProcess: true});
		await this.minerProcess.start();
		await wait(5000);
		this.__handleEvents();
	}
	
	__handleEvents() {
		
		writeInfo("Start listening blocks");
		
		const {miner, explorer} = this.config;
		const explorerBlocks = this.explorerBlocksProvider(explorer.apiUrl, explorer.pollInterval);
		const minerBlocks = this.minerBlocksProvider(miner.websocketUrl);
		
		const {exitKey} = keyOperations;
		const {connectionError} = errorOperations;
		const {purify, isExplorerBeforeMiner} = blockOperations;
		const {logBlockEvent, logBehindExplorer, logCloseEvent, updateMinerBlockState, updateExplorerBlockState} = blockEffects;
		const {logError} = errorEffects;
		
		const explorerBlockHeight$ = explorerBlocks.pluck('height').do(updateExplorerBlockState);
		const minerBlockHeight$ = minerBlocks.do(updateMinerBlockState);
		const minerClose$ = minerBlocks.closeEvents().do(logCloseEvent);
		const minerError$ = minerBlocks.errorEvents().do(logError);
		
		const requireRestart$ = minerBlockHeight$
			.combineLatest(explorerBlockHeight$)
			.let(purify)
			.do(logBlockEvent)
			.let(isExplorerBeforeMiner)
			.do(logBehindExplorer);
		
		const exitRequest$ = this.key$.let(exitKey);
		
		const minerConnectionError$ = minerError$
			.let(connectionError);
		
		const exit$ = minerConnectionError$
			.merge(exitRequest$, requireRestart$)
			.do(this.__exit)
			.first();
		
		const giveUp$ = $fakeBlocks
			.bufferTime(2000)
			.do(writeInfo)
			.filter(e => e.length > 3);

//		giveUp$.subscribe((e) => writeInfo(e, '[Give Up]') );
		
		minerClose$
			.merge(minerError$, requireRestart$)
			.takeUntil(exit$)
			.subscribe(this.__restartMiner);
	}
	
	async run() {
		await this.__initialize();
		await wait(2000);
		this.__handleEvents();
	}
}

module.exports = Watchdog;
