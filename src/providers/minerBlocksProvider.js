const {isDevelopmentMode} = require('@/utils');
const MinerListener = require(`@streams/observables/${isDevelopmentMode() ? 'simulation/' : ''}minerObservable`);

function provider(url) {
	const minerListener = new MinerListener(url);
	return {
		block$ : minerListener.blockEvents(),
		error$ : minerListener.errorEvents(),
		close$ : minerListener.closeEvents(),
	};
}

module.exports  = provider;
