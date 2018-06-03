const Rx = require('rxjs');
const ExplorerApi = require('./explorerApi');
const {writeError} = require('./utils');

class BlockExplorer {
	constructor(explorerBaseUrl, pollInterval) {
		this.__retryStrategy = this.__retryStrategy.bind(this);
		
		this.explorerBaseUrl = explorerBaseUrl;
		this.pollInterval = pollInterval * 1000;
	}
	
	__retryStrategy($errors) {
		const interval = 5 * this.pollInterval;
		return $errors.do((err) => {
			writeError(`Explorer has a problem:\n\t${err}`);
		}).delay(5 * interval)
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

module.exports = BlockExplorer;
