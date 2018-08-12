const Rx = require('rxjs');
const {filter, map, distinctUntilChanged} = require('rxjs/operators');

const split = map(e => ({miner: e[0], explorer: e[1]}));
const distinctHeightsOnly = distinctUntilChanged((p, q) => p.miner === q.miner && p.explorer === q.explorer);
const isExplorerBeforeMiner = filter(h => h.explorer > h.miner);

const purify = Rx.pipe(
	split,
	distinctHeightsOnly,
);

module.exports = {
	isExplorerBeforeMiner,
	purify
};
