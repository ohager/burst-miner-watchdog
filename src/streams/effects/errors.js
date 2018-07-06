const {writeError} = require('@/utils');
const {errorUpdater} = require('@/state/updaters');

function logError(err) {
	writeError(`We have a problem:\n\t${err}`);
	errorUpdater(err);
}

module.exports = {
	logError
};
