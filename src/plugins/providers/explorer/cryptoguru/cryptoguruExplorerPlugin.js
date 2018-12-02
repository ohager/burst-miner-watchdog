const {interval, from}  = require('rxjs');
// FIXME: remove dependencies... plugin must be self-constaining
// TODO: may interesting to offer kind of sdk (burst-miner-watch-sdk)
const ExplorerApi = require('../../../../explorerApi');
const {logError} = require('../../../../effects/errors');
const {writeInfo} = require('../../../../utils');
const ProviderPlugin = require('../../../../plugins/providerPlugin');
const config = require('./config');

const MAX_RETRY_INTERVAL = 5 * 60 * 1000;

class ExplorerPlugin extends ProviderPlugin {
	constructor() {
		super("CryptoGuru Explorer");
		this.__retryStrategy = this.__retryStrategy.bind(this);
		
		this.pollInterval = config.pollInterval * 1000;
		this.retryInterval = this.__getInitialRetryInterval();
		
		const api = new ExplorerApi(config.baseUrl);
		this.lastBlock$ = interval(this.pollInterval)
			.flatMap(() => from(api.getLastBlock()))
			.distinctUntilChanged((p,q) => p.height === q.height)
			.retryWhen(this.__retryStrategy)
	}
	
	__getInitialRetryInterval() { return this.pollInterval * 2 }
	
	__retryStrategy(error$) {
		this.retryInterval = Math.min(this.retryInterval * 2, MAX_RETRY_INTERVAL);
		return error$
			.tap(logError)
			.tap(() => {writeInfo(`Retry contacting explorer in ${this.retryInterval/1000} seconds`)})
			.delay(this.retryInterval)
	}
	
	provide() {
		return this.lastBlock$;
	}
}

module.exports = ExplorerPlugin;
