const readline = require('readline');
const WebSocket = require('ws');
const explorerListener = require('./explorerListener');

// miner
/*
const ws = new WebSocket('ws://localhost:8124/');
ws.on('message', data =>  {
	console.log(data);
});
*/


// Allows us to listen for events from stdin
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', async (str, key) => {
	
	if( key.name === 'escape' ||
		key.sequence === '\u0003'
	){
		console.log("Stopping listener...");
		await explorerListener.stop();
		process.exit(0);
	}
	
	console.log("Press ESC to exit");
});

explorerListener.start( lastBlocks => {
	console.log(lastBlocks.length > 0 ? lastBlocks[0] : "Nothing returned");
} );
