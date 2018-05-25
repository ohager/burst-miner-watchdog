const api = require('./explorerApi');
const throttle = require('lodash.throttle');

const LISTEN_INTERVAL = 500;
const REQUEST_INTERVAL = 5000;

async function request(cb) {
	
	const lastBlocks = await api.getLastBlocks();
	cb.call(null, lastBlocks);
	
}

class BurstExplorerListener {
	constructor() {
		this.requestStop = false;
		this.interval = null;
	}
	
	start(cb) {
		this.requestStop = false;
		const throttledRequest = throttle(request.bind(this, cb), REQUEST_INTERVAL);
		
		return new Promise(((resolve, reject) => {
			
			this.interval = setInterval(async () => {
				
				if (this.requestStop) {
					clearInterval(this.interval);
					resolve();
				}
				throttledRequest();
			}, LISTEN_INTERVAL)
		}))
	}
	
	stop() {
		return new Promise((resolve, reject) => {
			this.requestStop = true;
			setTimeout(() => {
				resolve();
			}, LISTEN_INTERVAL * 2);
		})
	}
}

module.exports = new BurstExplorerListener();
