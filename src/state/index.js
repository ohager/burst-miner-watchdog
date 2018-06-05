const selectors = require('./selectors');
const {state} = require('./state');
const updaters = require('./updaters');

module.exports = {
	updaters,
	selectors,
	state,
};
