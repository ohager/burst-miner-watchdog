const Rx = require('rxjs');
const {filter, scan, map, pluck, distinctUntilChanged} = require('rxjs/operators');
const {highlight} = require('cli-highlight');

const BlockExplorer = require('./blockExplorer');
const MinerListener = require('./minerListener');
const MinerProcess = require('./minerProcess');
const KeyListener = require('./keyListener');
const config = require('./config');
const {writeInfo, writeWarning, writeError} = require('./utils');
const state = require('./state');

const $fakeBlocks = Rx.Observable.interval(1000)
	.scan((acc, curr) => acc -= 500, 500000)
	.do(state.updateBlockFn('fake'));


class Watchdog {

	constructor(){
		
		this.__initialize = this.__initialize.bind(this);
		this.__listenBlocks = this.__listenBlocks.bind(this);
		this.__exit = this.__exit.bind(this);
		this.__restart = this.__restart.bind(this);
		
		
		this.subscriptionForBlocks = null;
		this.minerProcess = new MinerProcess(config.MinerExe);
		this.blockExplorer = new BlockExplorer(config.ExplorerApiUrl);
		this.miner = new MinerListener(config.MinerWebsocketUrl);
		
		function printState() {
			const json = highlight(JSON.stringify(state.get(), null, 4), {language:'json'});
			writeInfo(`\n\n${json}\n`, "[STATE]");
		}
		
		const keyListener = new KeyListener();
		this.$keys = keyListener.listen();
		this.$keys.filter(({name}) => name === 's').subscribe(printState);
		
		this.$exitEvent = this.$keys.filter(({name, sequence}) => name === 'escape' || sequence === '\u0003');
		this.$exitEvent.subscribe(this.__exit);
	}
	
	async __exit() {
		writeInfo("Exiting Watchdog...", "[BYE]");
		await this.minerProcess.stop();
		process.exit(0);
	}
	
	async __initialize() {
		
		writeInfo("Initializing watchdog...");
		const isRunning = await this.minerProcess.isRunning();
		if (!isRunning) await this.minerProcess.start();
		
	}
	
	async __restart() {
		writeInfo("Restarting...");
		this.subscriptionForBlocks.unsubscribe();
		await this.minerProcess.stop(false);
		await this.minerProcess.start();
		setTimeout(this.__listenBlocks, 2000);
	}
	
	__listenBlocks() {
		
		writeInfo("Start listening blocks");
		
		const $explorerBlockHeights = this.blockExplorer.lastBlocks().pluck('height').do(state.updateBlockFn('explorer'));
		const $minerBlockHeights = this.miner.blockheights().do(state.updateBlockFn('miner'));
		
		const log = e => writeInfo(JSON.stringify(e, null, 4), '[EVENT]');
		const split = map(e => ({miner: e[0], explorer: e[1]}));
		const distinctHeightsOnly = distinctUntilChanged((p, q) => p.miner === q.miner && p.explorer === q.explorer);
		const isExplorerBeforeMiner = filter(h => h.explorer > h.miner);
		const minerBehindExplorerOnly = Rx.pipe(
			split,
			distinctHeightsOnly,
			isExplorerBeforeMiner,
		);
		
		const $needRestartMinerEvent = $fakeBlocks
			.combineLatest($explorerBlockHeights)
			.let(minerBehindExplorerOnly)
			.takeUntil(this.$exitEvent);
		
		this.subscriptionForBlocks = $needRestartMinerEvent.do(log).subscribe(this.__restart);
		
	}
	
	async run() {
		await this.__initialize();
		this.__listenBlocks();
	}
}

const watchdog = new Watchdog();
watchdog.run();

