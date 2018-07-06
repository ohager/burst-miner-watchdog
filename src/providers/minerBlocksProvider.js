const MinerListener = require('@streams/observables/minerObservable');

function provider(url) {
	const minerListener = new MinerListener(url);
	return {
		block$ : minerListener.blockEvents(),
		error$ : minerListener.errorEvents(),
		close$ : minerListener.closeEvents(),
	};
}

module.exports  = provider;
