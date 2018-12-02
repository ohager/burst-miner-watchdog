const {writeWarning, writeSuccess} = require('../utils');
const {createBlockUpdater} = require('../state/updaters');

const blockString = e => `Blocks - Miner: ${e.miner}, Explorer: ${e.explorer}`;

const logBlockEvent = e => writeSuccess(`${blockString(e)}`, '[✓]');
const logBehindExplorer = e => writeWarning(`Miner Block is less than Explorer:\n${blockString(e)}`);

const logCloseEvent = () => writeWarning(`miner has closed connection...`);

const updateExplorerBlockState  = createBlockUpdater('explorer');
const updateMinerBlockState  = createBlockUpdater('miner');

module.exports = {
	logBlockEvent,
	logBehindExplorer,
	logCloseEvent,
	updateExplorerBlockState,
	updateMinerBlockState
};
