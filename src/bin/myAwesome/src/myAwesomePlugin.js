const HandlerPlugin = require('./handlerPlugin');

class myAwesomePlugin extends HandlerPlugin{
	constructor(){
		super('myAwesome')
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

module.exports = myAwesomePlugin;
