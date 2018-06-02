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
		config: {
			logger : {
				enabled : true,
				level : "debug"
			}
		},
		miner: defaultState(),
		explorer: defaultState(),
		restart: {
			count: 0,
			updateDateTime: isoDateNow()
		},
	})
);

stappo.updateBlockFn = (name) => (blockHeight) => {
	stappo.update((currentState) => ({
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
	stappo.update((currentState) => ({
			restart: {
				count: ++currentState.restart.count,
				updateDateTime: isoDateNow(),
			}
		})
	);
};

stappo.updateConfig = function (config) {
	stappo.update(() => ({
			config
		})
	);
};

stappo.updateLogger = function (logger) {
	const config = this.getConfig();
	stappo.update(() => ({
			config: {
				...config,
				logger :{
					...config.logger,
					...logger
				}
			}
		})
	);
};

stappo.getConfig = function () {
	return stappo.get().config;
};

module.exports = stappo;
