const {errorUpdater} = require('../../state/updaters');

function updateError({message}) {
	errorUpdater(message);
}

module.exports = {
	updateError
};
