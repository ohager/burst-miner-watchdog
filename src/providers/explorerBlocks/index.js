const ExplorerListener = require('./explorerListener');

function provider(baseUrl, pollInterval) {
	return new ExplorerListener(baseUrl, pollInterval).lastBlocks();
}

module.exports  = provider;
