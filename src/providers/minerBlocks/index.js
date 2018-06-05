const MinerListener = require('./minerListener');

function provider(url) {
	return new MinerListener(url).blockheights();
}

module.exports  = provider;
