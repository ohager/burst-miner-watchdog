const WebSocket = require('ws');
const Rx = require('rxjs');
const {writeError, writeSuccess, writeInfo} = require('./utils');

class Socket {
	constructor(url, name) {
		this.name = name;
		this.wsUrl = url;
		this.socket = new WebSocket(this.wsUrl);
		this.requestedStop = false;
		this.retryTimeout = null;
	}
	
	get connectionName() {
		return `'${this.name}'@[${this.wsUrl}]`;
	}
	
	events(name){
		return Rx.Observable.fromEvent(this.socket, 'message');
	}
	
	messageEvents() {
		return this.events('message');
	}
	
	errorEvents(){
		return this.events('error');
	}
	
	closeEvents(){
		return this.events('close');
	}
	
	/*
	start() {
		this.requestedStop = false;
		this.socket = new WebSocket(this.wsUrl);
		
		this.socket.on('error', (e) => {
			if (e.code === 'ECONNREFUSED') {
				writeError(`Could not connect to ${this.connectionName}`);
			}else{
				writeError(`Error for ${this.connectionName}`);
			}
		});
		
		this.socket.on('open', () => {
			writeSuccess(`Successfully connected to ${this.connectionName}`);
		});
		
		this.socket.on('close', () => {
			writeInfo(`Connection ${this.connectionName} closed`);
		});

		return Rx.Observable.fromEvent(this.socket, 'message');
	}
	*/
}

module.exports = Socket;
