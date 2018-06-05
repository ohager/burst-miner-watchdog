const Rx = require('rxjs');
const ExplorerApi = require('./explorerApi');
const {logError} = require('../../effects/errors');

class ExplorerListener {
	constructor(explorerBaseUrl, pollInterval) {
		this.__retryStrategy = this.__retryStrategy.bind(this);
		
		this.explorerBaseUrl = explorerBaseUrl;
		this.pollInterval = pollInterval * 1000;
	}
	
	__retryStrategy(error$) {
		const interval = 5 * this.pollInterval;
		return error$.do(logError).delay(interval)
	}
	
	lastBlocks() {
		const api = new ExplorerApi(this.explorerBaseUrl);
		return Rx.Observable
			.interval(this.pollInterval)
			.flatMap(() =>
				Rx.Observable.fromPromise(api.getLastBlock())
			)
			.retryWhen(this.__retryStrategy)
	}
}

module.exports = ExplorerListener;
