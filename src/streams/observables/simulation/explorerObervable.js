const KeyObservable = require('@streams/observables/keyObservable');
const {writeDebug} = require('@/utils');

const INC_BLOCK = '\u001b8';
const DEC_BLOCK = '\u001b9';
const RESET_BLOCK = '\u001b0';

const allowedBlockKeys = ({sequence}) => [INC_BLOCK, DEC_BLOCK, RESET_BLOCK].indexOf(sequence) >= 0;

function keyReducer(acc, {sequence}) {
	switch (sequence) {
		case INC_BLOCK:
			return ++acc;
		case DEC_BLOCK:
			return acc ? --acc : 0;
		case RESET_BLOCK:
			return 0;
		default: return acc;
	}
}

class ExplorerSimulationObservable {
	
	constructor(){
		this.key$ = new KeyObservable().get();
	}
	
	lastBlocks() {
		return this.key$
			.filter(allowedBlockKeys)
			.scan(keyReducer, 0)
			.map(n => ({height: n}))
			.do( ({height}) => writeDebug("Explorer Block: " + height, '[TEST]'))
		
	}
}

module.exports = ExplorerSimulationObservable;
