const readline = require('readline');
const ExplorerListener = require('./explorerListener');
const creepMinerDataReader = require('./creepMinerDataReader');
const MinerListener = require('./minerListener');
const config = require('./config');

// todo: user rxjs for this!
const minerListener = new MinerListener(config.MinerWebsocketUrl);
const explorerListener = new ExplorerListener(config.ExplorerApiUrl);

minerListener.start( data => {
	console.log('received data');
});

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', async (str, key) => {
	
	if( key.name === 'escape' ||
		key.sequence === '\u0003'
	){
		console.log("Stopping listener...");
		minerListener.stop();
		await explorerListener.stop();
		process.exit(0);
	}
	
	console.log("Press ESC to exit");
});


explorerListener.start( lastBlocks => {
	console.log(lastBlocks.length > 0 ? lastBlocks[0] : "Nothing returned");
} );
