const HandlerPlugin = require('./handlerPlugin');

class ${pluginName} extends HandlerPlugin{
	constructor(){
		super('${name}')
	}

	onEvent(eventType, event){
		this[eventType](event);
	}

	onMinerError(e){}
	onMinerClose(e){}
	onMinerStuck(e){}
	onMinerBlock(e){}
	onExplorerBlock(e){}
	onNewBlock(e){}
	onRestart(e){}
	onStart(e){}
	onExit(e){}
	onKey(e){}

}

module.exports = ${pluginName};
