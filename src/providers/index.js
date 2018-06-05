const minerBlocksProvider = require('./minerBlocks');
const explorerBlocksProvider = require('./explorerBlocks');
const keysProvider = require('./keys');
const loggerProvider = require('./logger');
const minerProcessProvider = require('./minerProcess');

module.exports = {
	minerBlocksProvider,
	explorerBlocksProvider,
	keysProvider,
	loggerProvider,
	minerProcessProvider,
};
