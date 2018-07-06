const ExplorerObservable = require('@streams/observables/explorerObervable');

function provider(baseUrl, pollInterval) {
	return new ExplorerObservable(baseUrl, pollInterval).lastBlocks();
}

module.exports  = provider;
