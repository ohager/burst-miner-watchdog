const {filter, map, scan, tap} = require('rxjs/operators');
// FIXME: remove dependencies... plugin must be self-constaining
// TODO: may interesting to offer kind of sdk (burst-miner-watch-sdk)
const keyObservable = require('../../../../streams/observables/keyObservable');
const {printHelp} = require('../../../../streams/effects/keys');
const {forKey} = require('../../../../streams/operations/keys');
const {writeDebug} = require('../../../../utils');
const ProviderPlugin = require('../../../../plugins/providerPlugin');

const INC_BLOCK = '<';
const DEC_BLOCK = '>';
const RESET_BLOCK = '?';
const RAISE_EXCEPTION = 'E';
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

class ExplorerMock extends ProviderPlugin {
	
	constructor() {
		super('Mocked Explorer');
		const key$ = keyObservable.get();
		
		this.lastBlock$ = key$
			.pipe(
				filter(allowedBlockKeys),
				tap(forKey(SHOW_HELP)(() => printHelp(keyMap, 'Explorer Simulator'))),
				scan(keyReducer, 0),
				map(n => ({height: n})),
				tap(({height}) => writeDebug("Explorer Block: " + height, '[TEST]'))
			)
	}
	
	provide() {
		return this.lastBlock$;
	}
}

module.exports = ExplorerMock;
