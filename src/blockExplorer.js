const Rx = require('rxjs');
const chalk = require('chalk');
const ExplorerApi = require('./explorerApi');
const config = require('./config');
const {writeError} = require('./utils');

const bright = chalk.bold.yellowBright;
const POLL_INTERVAL = config.ExplorerPollInterval * 1000;

class BlockExplorer {
	constructor(explorerBaseUrl) {
		this.explorerBaseUrl = explorerBaseUrl;
	}
	
	__retryStrategy($errors) {
		return $errors.do( (err) =>{
			writeError(`Explorer has a problem:\n\t${bright(err)}`);
		} ).delay(5 * POLL_INTERVAL)
	}
	
	lastBlocks() {
		const api = new ExplorerApi(this.explorerBaseUrl);
		return Rx.Observable
			.interval(POLL_INTERVAL)
			.flatMap(i =>
				Rx.Observable.fromPromise(api.getLastBlock())
			)
			.retryWhen(this.__retryStrategy)
	}
}

module.exports = BlockExplorer;
