const WebSocket = require('ws');
const Rx = require('rxjs');

class Socket {
	constructor(url, name) {
		this.name = name;
		this.wsUrl = url;
		this.socket = new WebSocket(this.wsUrl);
	}
	
	get connectionName() {
		return `'${this.name}'@[${this.wsUrl}]`;
	}
	
	events(name){
		return Rx.Observable.fromEvent(this.socket, name);
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
	
}

module.exports = Socket;
