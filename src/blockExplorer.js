const Rx = require('rxjs');
const chalk = require('chalk');
const ExplorerApi = require('./explorerApi');
const config = require('../config');
const {writeError} = require('./utils');

const bright = chalk.bold.yellowBright;

class BlockExplorer {
	constructor(explorerBaseUrl, pollInterval) {
		this.explorerBaseUrl = explorerBaseUrl;
		this.pollInterval = pollInterval * 1000;
	}
	
	__retryStrategy($errors) {
		return $errors.do( (err) =>{
			writeError(`Explorer has a problem:\n\t${bright(err)}`);
		} ).delay(5 * this.pollInterval)
	}
	
	lastBlocks() {
		const api = new ExplorerApi(this.explorerBaseUrl);
		return Rx.Observable
			.interval(this.pollInterval)
			.flatMap(i =>
				Rx.Observable.fromPromise(api.getLastBlock())
			)
			.retryWhen(this.__retryStrategy)
	}
}

module.exports = BlockExplorer;
