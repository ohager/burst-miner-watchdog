const KeyObservable = require('@streams/observables/keyObservable');
const {sequence} = require('@streams/operations/keys');
const {writeDebug} = require('@/utils');

const INC_BLOCK = '8';
const DEC_BLOCK = '9';
const RESET_BLOCK = '0';

const RAISE_ERROR = '6';
const CLOSE_CONNECTION = '7';

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

class MinerSimulationObservable {
	
	constructor(){
		this.key$ = new KeyObservable().get();
	}
	
	blockEvents() {
		return this.key$
			.filter(allowedBlockKeys)
			.scan(keyReducer, 0)
			.do(blockHeight => writeDebug(`Miner Block: ${blockHeight}`, '[TEST]'))
	}
	
	errorEvents() {
		return this.key$
			.let(sequence(RAISE_ERROR))
			.map(() => 'MinerSimulationObservable: Just a test exception');
	}
	
	closeEvents() {
		return this.key$
			.let(sequence(CLOSE_CONNECTION));
	}
}

module.exports = MinerSimulationObservable;
