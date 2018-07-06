const Socket = require('@/socket');

class MinerObservable extends Socket {
	
	constructor(url) {
		super(url, 'miner');
	}
	
	blockEvents() {
		return this.messageEvents()
			.map(e => JSON.parse(e.data))
			.filter(e => !!e.block)
			.map(e => +e.block)
	}
}

module.exports = MinerObservable;
