const {writeError, writeWarning, writeSuccess} = require('./utils');
const state = require('./state');

const MAX_ACCEPTED_IDLE_TIME = 10 * 60 * 1000;

const isTooMuchTimeWithoutActivity = () => ((Date.now() - state.get().miner.updateTimestamp) > MAX_ACCEPTED_IDLE_TIME);
const isBlockHeightDivergent = () => {
	const {pool, miner, explorer} = state.get();
	
	// prefer pool over explorer
	if (pool.blockHeight && miner.blockHeight) {
		// pool and miner should have at maximum 1 block difference, but 2 makes us sure, that something is weird
		return Math.abs(pool.blockHeight - miner.blockHeight) > 2
	}
	
	// if pool is not reachable, we have a fallback to explorer
	if (miner.blockHeight && explorer.blockHeight) {
		// explorer block is always behind the miner...if not, miner is inactive
		return explorer.blockHeight > miner.blockHeight
	}
	// not enough information to confirm divergent block height
	return false;
};


function eventuallyRestartMiner() {
	
	let needRestart = false;
	if(isTooMuchTimeWithoutActivity()){
		writeError("Last contact to miner is too long ago...restarting miner");
		needRestart = true;
	}
	
	if(isBlockHeightDivergent()){
		writeError("Listened blocks are too inconsistent...restarting miner");
		needRestart = true;
	}

	// TODO: see how to restart miner teh best way? Emit Events?
	
}

function handleSocketEvent(event, name) {
	if (!event || !event[name]) return;
	
	const s = state.get()[name];
	const json = JSON.parse(event[name].data);
	const blockHeight = +json.height || +json.blockheight;
	
	if (blockHeight && s.blockHeight !== blockHeight) {
		writeSuccess(`${name}: ${blockHeight}`);
		state.update(() => ({
				[name]: {
					updateTimestamp: Date.now(),
					blockHeight: blockHeight
				}
			})
		);
	}
}

function handleExplorerEvent(event) {
	if (!event) return;
	
	const lastState = state.get();
	
	if (event.height && lastState.explorer.blockHeight !== event.height) {
		
		state.update(() => ({
				explorer: {
					blockHeight: event.height,
					updateTimestamp: Date.now(),
				}
			})
		);
		
		if (event.height > lastState.miner.blockHeight) {
			writeWarning(`Block Explorer: ${event.height} (Miner is behind: ${lastState.miner.blockHeight})`)
		} else {
			writeSuccess(`Block Explorer: ${event.height}`);
		}
	}
	
}

function handler(event) {
	
	handleSocketEvent(event, 'pool');
	handleSocketEvent(event, 'miner');
	handleExplorerEvent(event.explorer);
	
	eventuallyRestartMiner();
}

module.exports = handler;
