const Rx = require('rxjs');
const ExplorerApi = require('./explorerApi');

const REQUEST_INTERVAL = 5000;

class BurstExplorerListener {
	constructor(explorerBaseUrl) {
		this.explorerBaseUrl = explorerBaseUrl;
	}
	
	start(cb) {
		const api =  new ExplorerApi(this.explorerBaseUrl);
		return Rx.Observable
			.interval(REQUEST_INTERVAL)
			.flatMap( i => Rx.Observable.fromPromise(api.getLastBlock()) );
	}
}

module.exports = BurstExplorerListener;
