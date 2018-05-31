const path = require('path');
const {exec, spawn} = require('child_process');
const process = require('process');
const findProcess = require('find-process');
const config = require('./config');
const {writeInfo, writeWarning, writeSuccess, wait} = require('./utils');

class MinerProcess {
	
	constructor(execPath) {
		this.execPath = execPath;
		this.execPath = execPath;
		this.pingInterval = null;
	}
	
	get processName() {
		return path.basename(this.execPath);
	}
	
	__poll() {
		
		if (this.pingInterval) {
			clearInterval(this.pingInterval);
		}
		
		this.pingInterval = setInterval(async () => {
			const isRunning = await this.isRunning();
			if (!isRunning) {
				this.start();
			}
		}, config.MinerExePingInterval * 1000)
	}
	
	async isRunning() {
		const processes = await this.getRunningProcesses();
		const isRunning = processes.length > 0;
		if (isRunning) {
			writeSuccess(`Miner process '${this.processName}' is running`, '[♥]')
		}
		else {
			writeWarning(`Miner process '${this.processName}' is not running`, '[♥]');
		}
		return isRunning;
	}
	
	async getRunningProcesses() {
		return await findProcess('name', this.processName);
	}
	
	async start() {
		if (!await this.isRunning()) {
			writeInfo(`Starting Miner process '${this.processName}'`);
			await spawn(config.MinerExe, [], {detached: true, shell: true});
		}
		this.__poll();
	}
	
	async stop({killChildProcess} = {killChildProcess: false}) {
		
		if (this.pingInterval) {
			clearInterval(this.pingInterval);
		}
		
		if (!killChildProcess) return;
		
		const processes = await this.getRunningProcesses();
		processes.forEach(p => {
			writeWarning(`Shutting down process [${p.name}](pid:${p.pid})`, '[KILL]');
			process.kill(p.pid);
		});
	}
	
}

module.exports = MinerProcess;
