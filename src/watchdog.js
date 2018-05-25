const ExplorerListener = require('./explorerListener');
const creepMinerDataReader = require('./creepMinerDataReader');
const MinerListener = require('./minerListener');
const keyListener = require('./keyListener');
const config = require('./config');

const minerListener = new MinerListener(config.MinerWebsocketUrl);
const explorerListener = new ExplorerListener(config.ExplorerApiUrl);

async function exitHandler() {
	console.log("Stopping listener...");
	minerListener.stop();
	await explorerListener.stop();
	process.exit(0);
}

keyListener
	.onEscape(exitHandler)
	.onControlC(exitHandler);

minerListener.start( data => {
	console.log('received data');
});

explorerListener.start( lastBlocks => {
	console.log(lastBlocks.length > 0 ? lastBlocks[0] : "Nothing returned");
} );
