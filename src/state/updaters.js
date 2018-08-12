const {state,timestamped} = require('./state');

const createBlockUpdater = name => blockHeight => {
	state.update(currentState => ({
			...currentState,
			[name]: timestamped({blockHeight})
		})
	)
};

const restartUpdater = function () {
	state.update(currentState => ({
			restart: timestamped({
				count: ++currentState.restart.count,
			})
		})
	);
};

const errorUpdater = function (errorMessage) {
	state.update(currentState => ({
			error: timestamped({
				count: ++currentState.error.count,
				exception: errorMessage
			})
		})
	);
};

const loggerUpdater = function (logger) {
	state.update(currentState => {
		const config = currentState.config;
		return {
			config: {
				...config,
				logger: {
					...config.logger,
					...logger
				}
			}
		}
	});
};

const configUpdater = function (config) {
	state.update(() => ({
			config
		})
	);
};

module.exports = {
	createBlockUpdater,
	restartUpdater,
	errorUpdater,
	loggerUpdater,
	configUpdater,
};
