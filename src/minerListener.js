const Socket = require('./socket');
const Rx = require('rxjs');
const {writeError, writeSuccess, writeInfo} = require('./utils');

class MinerListener extends Socket{
	
	constructor(url) {
		super(url, 'miner');
	}

	blockheights(){
		return this.messageEvents()
			.map( e => JSON.parse(e.data))
			.filter( e => !!e.blockheight )
			.map( e => +e.blockheight )
	}
}

module.exports = MinerListener;
