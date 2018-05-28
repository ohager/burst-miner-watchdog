const StappoClass = require('stappo');

const stappo = new StappoClass();

const defaultState = () => ({
	blockHeight: null,
	updateTimestamp: Date.now()
});

// initialize
stappo.update(() => ({
		miner: defaultState(),
		pool: defaultState(),
		explorer: defaultState()
	})
);

module.exports = stappo;
