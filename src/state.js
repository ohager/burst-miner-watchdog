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

stappo.updateBlockFn = (name) => (blockHeight) => {
	const currentState = stappo.get();
	stappo.update((s) => ({
			...currentState,
			[name]: {
				updateTimestamp: Date.now(),
				blockHeight
			}
			
		})
	)
};

stappo.updateBlock = function (name, blockHeight) {
	stappo.updateBlockFn(name)(blockHeight);
};


module.exports = stappo;
