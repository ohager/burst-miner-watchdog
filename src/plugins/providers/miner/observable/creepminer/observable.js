const Rx = require('rxjs');
const WebSocket = require('ws');
const MinerObservablePlugin = require('@/plugins/minerObservablePlugin');
const config = require('./config.json');

class Observable extends MinerObservablePlugin {
	
	constructor() {
		super('CreepMiner Observable');
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
	
	blockEvents() {
		return this.messageEvents()
			.map(e => JSON.parse(e.data))
			.filter(e => !!e.block)
			//.map(e => +e.block)
	}
	
	provide(){
		this.socket = new WebSocket(config.websocketUrl);
		super.provide()
	}
}

module.exports = Observable;
