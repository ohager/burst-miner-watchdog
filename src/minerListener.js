const WebSocket = require('ws');
const Rx = require('rxjs');
const {writeInfo, writeError, writeSuccess, waitFor} = require('./utils');

const CONNECT_RETRY_TIMEOUT = 3000;

class MinerListener {
	constructor(url) {
		this.wsUrl = url;
		this.socket = null;
		this.retryTimeout = null;
	}
	
	start() {
		this.socket = new WebSocket(this.wsUrl);
		
		this.socket.on('error', (e) => {
			if (e.code === 'ECONNREFUSED') {
				writeInfo(`Could not connect to [${this.wsUrl}]...reconnecting`);
				this.socket = null;
				this.retryTimeout = setTimeout(() => {
					this.start()
				}, CONNECT_RETRY_TIMEOUT)
			}else{
				writeError(`Error for [${this.wsUrl}]: ${e}`);
			}
		});
		
		this.socket.on('open', () => {
			writeSuccess(`Successfully connected to [${this.wsUrl}]`);
		});
		
		this.socket.on('close', () => {
			writeInfo(`Connection for [${this.wsUrl}] closed`);
			this.socket = null;
		});
		
		return Rx.Observable.fromEvent(this.socket, 'message');
	}
	
	async stop() {
		if (this.retryTimeout) clearTimeout(this.retryTimeout);
		if(this.socket) {
			this.socket.close();
			await waitFor(() => this.socket === null, 2000);
		}
	}
}

module.exports = MinerListener;
