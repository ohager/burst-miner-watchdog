const WebSocket = require('ws');

class MinerListener {
	constructor(url) {
		this.wsUrl = url;
		this.socket = null;
	}
	
	start(cb) {
		this.socket = new WebSocket(this.wsUrl);
		this.socket.on('open', () => {
			console.log(`Successfully connected to ${this.wsUrl}`);
		});
		
		this.socket.on('close', () => {
			console.log(`Connection for [${this.wsUrl}] closed`);
		});
		
		this.socket.on('message', cb);
	}
	
	stop() {
		this.socket.close();
	}
}

module.exports = MinerListener;
