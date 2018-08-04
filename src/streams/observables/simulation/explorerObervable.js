const keysProvider = require('@/providers/keysProvider');
const {printHelp} = require('@streams/effects/keys');
const {forKey} = require('@streams/operations/keys');
const {writeDebug} = require('@/utils');

const INC_BLOCK = '<';
const DEC_BLOCK = '>';
const RESET_BLOCK = '?';
const SHOW_HELP = 'h';

const keyMap = {
	[INC_BLOCK]: 'Increments Explorer Block Height',
	[DEC_BLOCK]: 'Decrements Explorer Block Height',
	[RESET_BLOCK]: 'Resets Explorer Block Height to 0',
	[SHOW_HELP]: 'Shows Explorer Mock help',
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
		default:
			return acc;
	}
}

class ExplorerSimulationObservable {
	
	constructor() {
		const key$ = keysProvider();
		
		this.lastBlock$ = key$
			.filter(allowedBlockKeys)
			.do(forKey(SHOW_HELP)(() => printHelp(keyMap, 'Explorer Simulator')))
			.scan(keyReducer, 0)
			.map(n => ({height: n}))
			.do(({height}) => writeDebug("Explorer Block: " + height, '[TEST]'))
	}
	
	lastBlocks() {
		return this.lastBlock$;
		
	}
}

module.exports = ExplorerSimulationObservable;
