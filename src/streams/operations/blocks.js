const Rx = require('rxjs');
const {filter, map} = require('rxjs/operators');

const split = map(e => ({miner: e[0], explorer: e[1]}));

const isExplorerBeforeMiner = filter(h => h.explorer > h.miner);

const purify = Rx.pipe(
	split,
);

module.exports = {
	isExplorerBeforeMiner,
	purify
};
