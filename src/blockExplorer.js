const Rx = require('rxjs');
const ExplorerApi = require('./explorerApi');

const REQUEST_INTERVAL = 2000;

class BlockExplorer {
	constructor(explorerBaseUrl) {
		this.explorerBaseUrl = explorerBaseUrl;
	}
	
	lastBlocks() {
		const api =  new ExplorerApi(this.explorerBaseUrl);
		return Rx.Observable
			.interval(REQUEST_INTERVAL)
			.flatMap( i => Rx.Observable.fromPromise(api.getLastBlock()) );
	}
}

module.exports = BlockExplorer;
