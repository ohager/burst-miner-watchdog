const KeyObservable = require('@streams/observables/keyObservable');
const {sequence} = require('@streams/operations/keys');

const INC_BLOCK = '+';
const DEC_BLOCK = '-';
const RESET_BLOCK = '0';

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
			.map(n => ({block: n}));
	}
	
	errorEvents() {
		return this.key$
			.let(sequence('\u001be')) // Alt-e
			.map(() => "MinerSimulationObservable: Just a test exception");
	}
	
	closeEvents() {
		return this.key$
			.let(sequence('\u001bc')); // Alt-c
	}
}

module.exports = MinerSimulationObservable;
