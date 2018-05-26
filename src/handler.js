const {writeInfo, writeError, writeWarning} = require("./utils");


const MAX_ACCEPTED_IDLE_TIME = 10 * 60 * 1000;
const MAX_ACCEPTED_BLOCK_DIFFERENCE = 3;

let lastMinerActivity = Date.now();
let lastMinerBlockHeight = null;
let lastExplorerBlockHeight = null;


function eventuallyRestartMiner() {
	const needRestart = ((Date.now() - lastMinerActivity) > MAX_ACCEPTED_IDLE_TIME) ||
		(lastExplorerBlockHeight - lastMinerBlockHeight > MAX_ACCEPTED_BLOCK_DIFFERENCE);
	
	if (needRestart) {
		writeError("Need to restart miner");
	}
	
}

function handleMinerEvent(event) {
	if (!event) return;
	
	lastMinerActivity = Date.now();
	const json = JSON.parse(event);
	if (json.blockheight && lastMinerBlockHeight !== json.blockheight) {
		writeInfo(`Miner: ${json.blockheight}`);
		lastMinerBlockHeight = json.blockheight;
	}
}

function handleExplorerEvent(event) {
	if (!event) return;
	
	if (event.height && lastExplorerBlockHeight !== event.height) {
		
		if (event.height > lastMinerBlockHeight) {
			writeWarning(`Block Explorer: ${event.height} (Miner is behind!)`)
		} else {
			writeInfo(`Block Explorer: ${event.height}`);
		}
		lastExplorerBlockHeight = event.height;
	}
	
}

function handler(event) {
	
	handleMinerEvent(event.miner);
	handleExplorerEvent(event.explorer);
	
	eventuallyRestartMiner();
}

module.exports = handler;
