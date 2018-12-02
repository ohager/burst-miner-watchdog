const {fromEvent} = require('rxjs');
const {map, filter} = require('rxjs/operators');
const WebSocket = require('ws');
// FIXME: remove dependencies... plugin must be self-constaining
// TODO: may interesting to offer kind of sdk (burst-miner-watch-sdk)
const MinerObservablePlugin = require('../../../../minerObservablePlugin');
const config = require('./config.json');

class Observable extends MinerObservablePlugin {
	
	constructor() {
		super('CreepMiner Observable');
	}
	
	events(name) {
		return fromEvent(this.socket, name);
	}
	
	messageEvents() {
		return this.events('message');
	}
	
	errorEvents() {
		return this.events('error');
	}
	
	closeEvents() {
		return this.events('close');
	}
	
	blockEvents() {
		return this.messageEvents().pipe(
			map(e => JSON.parse(e.data)),
			filter(e => !!e.block),
		)
	}
	
	provide() {
		this.socket = new WebSocket(config.websocketUrl);
		super.provide()
	}
}

module.exports = Observable;
