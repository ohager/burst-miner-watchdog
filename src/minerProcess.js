const process = require('process');
const path = require('path');
const {spawn} = require('child_process');
const listProcesses = require('ps-list');

const {writeInfo, writeWarning, writeSuccess} = require('@/utils');

function windowsify(path) {
	if (process.platform !== 'win32') return path;
	
	let windowsPath = path;
	if (!windowsPath.startsWith('\"')) {
		windowsPath = `\"${windowsPath}`;
	}
	if (!windowsPath.endsWith('\"')) {
		windowsPath += '\"';
	}
	
	return windowsPath;
}

class MinerProcess {
	
	constructor(execPath, pingInterval) {
		this.execPath = execPath;
		this.pingInterval = pingInterval * 1000;
		
		this.pingIntervalHandler = null;
	}
	
	get workingDir() {
		return path.dirname(this.execPath);
	}
	
	get processName() {
		return path.basename(this.execPath);
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
		const processes = await this.getRunningProcesses();
		
		const isRunning = processes.length > 0;
		if (isRunning) {
			writeSuccess(`Miner process [${this.processName}] is running`, '[♥]')
		}
		else {
			writeWarning(`Miner process [${this.processName}] is not running`, '[♥]');
		}
		return isRunning;
	}
	
	async getRunningProcesses() {
		const processes = await listProcesses();
		return processes.filter( ({name}) => name.toLowerCase() === this.processName.toLowerCase() );
	}
	
	async start() {
		if (!await this.isRunning()) {
			await spawn(windowsify(this.execPath), [], {
				detached: true,
				shell: true,
				windowsVerbatimArguments: true,
				cwd: this.workingDir
			});
		}
		this.__poll();
	}
	
	async stop({killChildProcess} = {killChildProcess: false}) {
		
		if (this.pingIntervalHandler) {
			clearInterval(this.pingIntervalHandler);
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
