const MinerProcess = require('./minerProcess');

function provider(execPath, pingInterval) {
	return new MinerProcess(execPath, pingInterval);
}

module.exports  = provider;
