const {writeInfo, writeError, writeWarning} = require('./utils');

const MAX_ACCEPTED_IDLE_TIME = 10 * 60 * 1000;
const MAX_ACCEPTED_BLOCK_DIFFERENCE = 3;

const defaultState = {
	blockHeight: null,
	updateTimestamp: null
};

let state = {
	miner: defaultState,
	pool: defaultState,
	explorer: defaultState
};

function eventuallyRestartMiner() {
	
	const needRestart = ((Date.now() - state.miner.updateTimestamp) > MAX_ACCEPTED_IDLE_TIME) ||
		(state.explorer.blockHeight - state.miner.blockHeight > MAX_ACCEPTED_BLOCK_DIFFERENCE);
	
	if (needRestart) {
		writeError("Need to restart miner");
	}
	
}

function handleSocketEvent(event, name) {
	if (!event || !event[name]) return;
	
	let s = state[name];
	s.updateTimestamp = Date.now();
	
	const json = JSON.parse(event[name].data);
	const blockHeight = json.height || json.blockheight;
	
	if (blockHeight && s.blockHeight !== blockHeight) {
		writeInfo(`${name}: ${blockHeight}`);
		s.blockHeight = blockHeight;
	}
}


function handleExplorerEvent(event) {
	if (!event) return;
	
	if (event.height && state.explorer.blockHeight !== event.height) {
		
		if (event.height > state.explorer.blockHeight) {
			writeWarning(`Block Explorer: ${event.height} (Miner is behind!)`)
		} else {
			writeInfo(`Block Explorer: ${event.height}`);
		}
		state.explorer.blockHeight = event.height;
	}
	
}

function handler(event) {

	// TODO view how to use RX
	handleSocketEvent(event, 'pool');
	handleSocketEvent(event, 'miner');
	handleExplorerEvent(event.explorer);
	
	eventuallyRestartMiner();
}

module.exports = handler;
