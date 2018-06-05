const Socket = require('./socket');

class MinerListener extends Socket {
	
	constructor(url) {
		super(url, 'miner');
	}
	
	blockheights() {
		return this.messageEvents()
			.map(e => JSON.parse(e.data))
			.filter(e => !!e.blockheight)
			.map(e => +e.blockheight)
	}
}

module.exports = MinerListener;
