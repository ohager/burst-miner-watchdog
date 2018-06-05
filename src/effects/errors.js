const {writeError} = require('../utils');
const {updaters} = require('../state');

function logError(err) {
	writeError(`We have a problem:\n\t${err}`);
	updaters.errorUpdater(err);
}

module.exports = {
	logError
};
