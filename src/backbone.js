const {combineLatest, merge} = require('rxjs');
const {pluck, map, tap, takeUntil} = require('rxjs/operators');

const {selectors: $, updaters} = require('./state');

const keyObservable = require('./streams/observables/keyObservable');
const keyEffects = require('./streams/effects/keys');
const blockEffects = require('./streams/effects/blocks');
const errorEffects = require('./streams/effects/errors');
const blockOperations = require('./streams/operations/blocks');
const errorOperations = require('./streams/operations/errors');
const keyOperations = require('./streams/operations/keys');
const {writeInfo, wait} = require('./utils');

const MAX_RESTART_ATTEMPTS = 10;
const RESTART_DELAY = 3000;

const PRINT_CONFIG = 'c';
const PRINT_HELP = 'h';
const TOGGLE_LOGGER = 'l';
const RESTART_MINER = 'r';
const SHOW_STATE = 's';

const keyMap = {
	[PRINT_CONFIG]: 'Shows current configuration',
	[PRINT_HELP]: 'Prints this help',
	[TOGGLE_LOGGER]: 'Toggles through logger settings',
	[RESTART_MINER]: 'Restarts miner manually',
	[SHOW_STATE]: 'Shows current watchdog state',
	'ESC, CTRL-C': 'Exit'
};

class Backbone {
	
	constructor({explorerProvider, minerObservableProvider, minerProcessProvider, handler}) {
		
		this.__initialize = this.__initialize.bind(this);
		this.__handleEvents = this.__handleEvents.bind(this);
		this.__exit = this.__exit.bind(this);
		this.__restartMiner = this.__restartMiner.bind(this);
		this.__createPluginCaller = this.__createPluginCaller.bind(this);
		
		this.config = $.selectConfig();
		
		this.minerProcess = minerProcessProvider.provide();
		this.explorerBlocksProvider = explorerProvider;
		this.minerBlocksProvider = minerObservableProvider;
		this.handlerPlugins = handler;
		
		const {forKey} = keyOperations;
		this.key$ = keyObservable.get();
		this.key$.pipe(
			// make plugin caller subject and broadcast events - this is still imperative
			tap(this.__createPluginCaller('onKey')),
			tap(forKey(PRINT_CONFIG)(keyEffects.printConfiguration)),
			tap(forKey(TOGGLE_LOGGER)(keyEffects.toggleLogger)),
			tap(forKey(SHOW_STATE)(keyEffects.printState)),
			tap(forKey(PRINT_HELP)(() => keyEffects.printHelp(keyMap))),
			tap(forKey(RESTART_MINER)(this.__restartMiner, this)),
		).subscribe();
		
		this.restartRetrialCounter = 0;
		
		this.__createPluginCaller("onStart")(this.config);
	}
	
	__createPluginCaller(eventName) {
		return this.__callPlugins.bind(this, eventName);
	}
	
	__callPlugins(eventType, event) {
		this.handlerPlugins.forEach(plugin => plugin.onEvent(eventType, event));
	}
	
	async __initialize() {
		writeInfo("Initializing Watchdog...");
		await this.minerProcess.start();
	}
	
	async __exit(e) {
		this.__createPluginCaller("onExit")(e);
		writeInfo("Exiting Watchdog...", "[BYE]");
		//await this.minerProcess.stop({killChildProcess: $.selectIsAutoClose()});
		await this.minerProcess.stop({killChildProcess: true});
		process.exit(0);
	}
	
	async __restartMiner() {
		
		this.restartSubscription.unsubscribe();
		
		if (++this.restartRetrialCounter > MAX_RESTART_ATTEMPTS) {
			this.__exit({reason: 'Exceeded restart attempts for miner'});
			return;
		}
		
		writeInfo("Restarting Miner...");
		updaters.restartUpdater();
		await this.minerProcess.stop({killChildProcess: true});
		await this.minerProcess.start();
		await wait(RESTART_DELAY); // wait for process establishing connections
		
		this.__handleEvents();
	}
	
	__handleEvents() {
		
		writeInfo("Start listening blocks");
		
		//const {miner, explorer} = this.config;
		
		const {blockEvents: block$, errorEvents: error$, closeEvents: close$} = this.minerBlocksProvider.provide();
		const explorerBlock$ = this.explorerBlocksProvider.provide();
		
		const {exitKey} = keyOperations;
		const {purify, isExplorerBeforeMiner} = blockOperations;
		const {updateMinerBlockState, updateExplorerBlockState} = blockEffects;
		const {updateError} = errorEffects;
		
		const explorerBlockHeight$ = explorerBlock$
			.pipe(
				tap(this.__createPluginCaller('onExplorerBlock')),
				pluck('height'),
				tap(updateExplorerBlockState),
			);
		
		const minerBlockHeight$ = block$
			.pipe(
				tap(() => {
					this.restartRetrialCounter = 0
				}),
				tap(this.__createPluginCaller('onMinerBlock')),
				pluck('block'),
				map(b => +b),
				tap(updateMinerBlockState),
			);
		
		const minerClose$ = close$
			.pipe(
				tap(this.__createPluginCaller('onMinerClose')),
			);
		
		const minerError$ = error$
			.pipe(
				tap(this.__createPluginCaller('onMinerError')),
				tap(updateError),
			);
		
		const exitRequest$ = this.key$
			.pipe(
				exitKey,
				tap(this.__exit.bind(this, {reason: "Requested by user"})),
			);
		
		const minerStuck$ = combineLatest(minerBlockHeight$, explorerBlockHeight$)
			.pipe(
				purify,
				tap(this.__createPluginCaller('onNewBlock')),
				isExplorerBeforeMiner,
				tap(this.__createPluginCaller('onMinerStuck')),
			);
		
		this.restartSubscription = merge(minerClose$, minerError$, minerStuck$)
			.pipe(
				takeUntil(exitRequest$),
				tap(this.__createPluginCaller('onRestart')),
			)
			.subscribe(this.__restartMiner);
		
	}
	
	async run() {
		await this.__initialize();
		await wait(3000);
		this.__handleEvents();
	}
}

module.exports = Backbone;
