const {writeError} = require('@/utils');
const {errorUpdater} = require('@/state/updaters');

function logError({message}) {
	writeError(`We have a problem:\n\t${message}`);
	errorUpdater(message);
}

module.exports = {
	logError
};
