const config = require("./config.json");
// FIXME: remove dependencies... plugin must be self-constaining
// TODO: may interesting to offer kind of sdk (burst-miner-watch-sdk)
const ProviderPlugin = require('../../../../providerPlugin');
const {writeDebug, writeWarning, writeSuccess} = require('../../../../../utils');

class Process extends ProviderPlugin {
	
	constructor() {
		super('Mockminer Process');
		this.pingInterval = config.pingInterval * 1000;
		this.pingIntervalHandler = null;
	}
	
	__poll() {
		if (this.pingIntervalHandler) {
			clearInterval(this.pingIntervalHandler);
		}
		
		this.pingIntervalHandler = setInterval(async () => {
			const isRunning = await this.isRunning();
			if (!isRunning) {
				this.start();
			}
		}, this.pingInterval)
	}
	
	async isRunning() {
		writeSuccess(`Miner Mock is running`, '[♥]');
		return Promise.resolve(true);
	}
	
	async start() {
		this.__poll();
		writeDebug('Starting Miner Mock', '[TEST]');
		return Promise.resolve();
	}
	
	async stop({killChildProcess} = {killChildProcess: false}) {
		writeWarning(`Shutting down mocked process`, '[KILL]');
		return Promise.resolve();
	}
	
	provide(){
		return {
			isRunning : this.isRunning.bind(this),
			start: this.start.bind(this),
			stop: this.stop.bind(this),
		}
	}
	
}

module.exports = Process;
