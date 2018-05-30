const BlockExplorer = require('./blockExplorer');
const MinerListener = require('./minerListener');
const MinerProcess = require('./minerProcess');
const Rx = require('rxjs');
const {filter, scan, map, pluck, distinctUntilChanged} = require('rxjs/operators');
const keyListener = require('./keyListener');
const config = require('./config');
const {writeInfo, writeWarning, writeError} = require('./utils');
const state = require('./state');

const minerProcess = new MinerProcess(config.MinerExe);
const blockExplorer = new BlockExplorer(config.ExplorerApiUrl);
const miner = new MinerListener(config.MinerWebsocketUrl);

const $keys = keyListener.listen();
const $explorerBlockHeights = blockExplorer.lastBlocks().pluck('height').do(state.updateBlockFn('explorer'));


const $fakeBlocks = Rx.Observable.interval(1000)
	.scan((acc, curr) => ++acc, 0)
	.do(state.updateBlockFn('fake'));

const $minerBlockHeights = miner.blockheights().do(state.updateBlockFn('miner'));

async function exit() {
	writeInfo("Exiting Watchdog...", "[BYE]");
	await minerProcess.stop();
	process.exit(0);
}

function printState() {
	writeInfo(`\n\n${JSON.stringify(state.get(), null, 4)}\n`, "[STATE]");
}

const $exitEvent = $keys.filter(({name, sequence}) => name === 'escape' || sequence === '\u0003');

async function initialize() {
	
	writeInfo("Initializing watchdog...");
	const isRunning = await minerProcess.isRunning();
	if (!isRunning) await minerProcess.start();
	
	const logEvent = e => writeInfo(JSON.stringify(e, null, 4), '[EVENT]');
	const split = map(e => ({miner: e[0], explorer: e[1]}));
	const distinctHeightsOnly = distinctUntilChanged((p, c) => {
		return p.miner === c.miner && p.explorer === c.explorer
	});
	const isExplorerBeforeMiner = filter(h => h.explorer > h.miner);
	const minerBehindExplorer = Rx.pipe(
		split,
		distinctHeightsOnly,
		isExplorerBeforeMiner,
	);
	
	$fakeBlocks.combineLatest($explorerBlockHeights)
		.let(minerBehindExplorer)
		.takeUntil( $exitEvent )
		.subscribe(logEvent);
	
}

initialize();

$exitEvent.subscribe(() => setTimeout(exit, 5000));

$keys.filter(({name}) => name === 's')
	.subscribe(printState);


