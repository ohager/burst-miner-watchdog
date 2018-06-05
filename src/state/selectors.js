const {state} = require('./state');

const select = (fn) => () => fn(state.get());

const selectConfig = select(s => s.config);
const selectIsAutoClose = select(s => s.config.miner.autoClose);
const selectLogger = select(s => s.config.logger);
const selectLoggerEnabled = select(s => s.config.logger.enabled);
const selectLoggerLevel = select(s => s.config.logger.level);
const selectErrorCount = select(s => s.error.count);

module.exports = {
	select,
	selectConfig,
	selectLogger,
	selectLoggerEnabled,
	selectLoggerLevel,
	selectIsAutoClose,
	selectErrorCount
};
