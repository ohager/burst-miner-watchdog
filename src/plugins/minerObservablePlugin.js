const ProviderPlugin = require('./providerPlugin');

function throwUnimplementedMethod(methodName, pluginName){
	throw `${methodName} method is not implemented by Plugin '${pluginName}'`
}

class MinerObservablePlugin extends ProviderPlugin {
	constructor(name){
		super(name);
	}
	
	blockEvents() {
		throwUnimplementedMethod('blockEvents', this.name);
	}
	errorEvents() {
		throwUnimplementedMethod('errorEvents', this.name);
	}
	closeEvents() {
		throwUnimplementedMethod('closeEvents', this.name);
	}
	
	provide(){
		return {
			blockEvents : this.blockEvents(),
			errorEvents : this.errorEvents(),
			closeEvents : this.closeEvents()
		}
	}
}

module.exports = MinerObservablePlugin;
