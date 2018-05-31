const StappoClass = require('stappo');
const {format} = require('date-fns');
const stappo = new StappoClass();

const isoDateNow = () => format(new Date());

const defaultState = () => ({
	blockHeight: null,
	updateDateTime: isoDateNow(),
});

// initialize
stappo.update(() => ({
		miner: defaultState(),
		explorer: defaultState(),
		restart: {
			count: 0,
			updateDateTime: isoDateNow()
		},
	})
);

stappo.updateBlockFn = (name) => (blockHeight) => {
	const currentState = stappo.get();
	stappo.update(() => ({
			...currentState,
			[name]: {
				updateDateTime: isoDateNow(),
				blockHeight
			}
			
		})
	)
};

stappo.updateBlock = function (name, blockHeight) {
	stappo.updateBlockFn(name)(blockHeight);
};

stappo.updateRestart = function () {
	const currentState = stappo.get();
	stappo.update(() => ({
			restart: {
				count: ++currentState.restart.count,
				updateDateTime: isoDateNow(),
			}
		})
	);
};


module.exports = stappo;
