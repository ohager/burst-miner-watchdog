const {filter, scan, map, tap} = require('rxjs/operators');
// FIXME: remove dependencies... plugin must be self-constaining
// TODO: may interesting to offer kind of sdk (burst-miner-watch-sdk)
const MinerObservablePlugin = require('../../../../minerObservablePlugin');
const keyObservable = require('../../../../../streams/observables/keyObservable');
const {sequence} = require('../../../../../streams/operations/keys');
const {printHelp} = require('../../../../../streams/effects/keys');
const {writeDebug} = require('../../../../../utils');

const INC_BLOCK = ',';
const DEC_BLOCK = '.';
const RESET_BLOCK = '/';

const RAISE_ERROR = 'e';
const CLOSE_CONNECTION = 'c';
const SHOW_HELP = 'h';

const keyMap = {
	[INC_BLOCK]: 'Increments Miner Block Height',
	[DEC_BLOCK]: 'Decrements Miner Block Height',
	[RESET_BLOCK]: 'Resets Miner Block Height to 0',
	[RAISE_ERROR]: 'Raises a mocked exception',
	[CLOSE_CONNECTION]: 'Closes the connection',
	[SHOW_HELP]: 'Shows Miner Mock help',
};

const allowedBlockKeys = ({sequence}) => Object.keys(keyMap).indexOf(sequence) >= 0;

function keyReducer(acc, {sequence}) {
	
	switch (sequence) {
		case INC_BLOCK:
			return ++acc;
		case DEC_BLOCK:
			return acc ? --acc : 0;
		case RESET_BLOCK:
			return 0;
		case SHOW_HELP:
			printHelp(keyMap, 'Miner Simulator');
		default:
			return acc;
	}
}

class Observable extends MinerObservablePlugin {
	
	constructor() {
		super("Mockminer Observable");
		const key$ = keyObservable.get();
		
		this.block$ = key$
			.pipe(
				filter(allowedBlockKeys),
				scan(keyReducer, 0),
				map(height => ({block: height})),
				tap(b => writeDebug(`Miner Block: ${b.block}`, '[TEST]'))
			);
		
		this.error$ = key$
			.pipe(
				sequence(RAISE_ERROR),
				map(() => 'MinerSimulationObservable: Just a test exception')
			);
		
		this.close$ = key$.pipe(sequence(CLOSE_CONNECTION));
	}
	
	blockEvents() {
		return this.block$;
	}
	
	errorEvents() {
		return this.error$;
	}
	
	closeEvents() {
		return this.close$;
	}
	
}

module.exports = Observable;
