const state = require('./state');

const select = (fn) => () => fn(state.get());

const selectIsAutoClose = select(s => s.config.miner.autoClose);
const selectLoggerEnabled = select(s => s.config.logger.enabled);
const selectLoggerLevel = select(s => s.config.logger.level);

module.exports = {
	select,
	selectLoggerEnabled,
	selectLoggerLevel,
	selectIsAutoClose
};
