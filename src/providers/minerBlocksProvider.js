const {isDevelopmentMode} = require('@/utils');
const MinerListener = isDevelopmentMode() ? require('@streams/observables/simulation/minerObservable') : require('@streams/observables/minerObservable');

function provider(url) {
	const minerListener = new MinerListener(url);
	return {
		block$ : minerListener.blockEvents(),
		error$ : minerListener.errorEvents(),
		close$ : minerListener.closeEvents(),
	};
}

module.exports  = provider;
