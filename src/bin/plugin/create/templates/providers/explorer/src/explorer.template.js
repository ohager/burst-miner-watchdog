const Rx = require('rxjs');
const ProviderPlugin = require('./providerPlugin');

/**
 * An Explorer Plugin provides a stream of most __recent mined blocks__ in the BURST network
 * Actually, it is only a request to any of the existing publicly available endpoints
 * that get the most recent mined block.
 *
 * A stream of block events is within the meaning of RxJS. You should dive into it!
 */
class ${pluginName} extends ProviderPlugin {
	constructor() {
		super("${name}");
		this.lastBlock$ = null;
		
		/*
		lastBlock$ is a stream of events of which an event has the following structure
		
		{
			height: <number>
		}
		
		*/
	}
	
	provide() {
		return this.lastBlock$;
	}
}

module.exports = ${pluginName};
