const {isDevelopmentMode} = require('@/utils');
const ExplorerObservable = require(`@streams/observables/${isDevelopmentMode() ? 'simulation/' : ''}explorerObservable`);

function provider(baseUrl, pollInterval) {
	return new ExplorerObservable(baseUrl, pollInterval).lastBlocks();
}

module.exports  = provider;
