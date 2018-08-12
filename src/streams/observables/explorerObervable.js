const Rx = require('rxjs');
const ExplorerApi = require('@/explorerApi');
const {logError} = require('@streams/effects/errors');
const {writeInfo} = require('@/utils');

const MAX_RETRY_INTERVAL = 5 * 60 * 1000;

class ExplorerObervable {
	constructor(explorerBaseUrl, pollInterval) {
		this.__retryStrategy = this.__retryStrategy.bind(this);
		
		this.explorerBaseUrl = explorerBaseUrl;
		this.pollInterval = pollInterval * 1000;
		
		this.retryInterval = this.__getInitialRetryInterval()
	}
	
	__getInitialRetryInterval() { return this.pollInterval * 2 }
	
	__retryStrategy(error$) {
		this.retryInterval = Math.min(this.retryInterval * 2, MAX_RETRY_INTERVAL);
		return error$
			.do(logError)
			.do(() => {writeInfo(`Retry contacting explorer in ${this.retryInterval/1000} seconds`)})
			.delay(this.retryInterval)
	}
	
	lastBlocks() {
		const api = new ExplorerApi(this.explorerBaseUrl);
		return Rx.Observable
			.interval(this.pollInterval)
			.flatMap(() => Rx.Observable.fromPromise(api.getLastBlock()))
			.distinctUntilChanged((p,q) => p.height === q.height)
			.retryWhen(this.__retryStrategy)
	}
}

module.exports = ExplorerObervable;
