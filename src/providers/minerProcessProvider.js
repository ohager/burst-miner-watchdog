const {isDevelopmentMode} = require('@/utils');
const MinerProcess = require(`@/${isDevelopmentMode() ? 'minerProcessMock' : 'minerProcess'}`);

function provider(execPath, pingInterval) {
	return new MinerProcess(execPath, pingInterval);
}

module.exports  = provider;
