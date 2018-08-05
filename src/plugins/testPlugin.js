const Plugin = require('../plugin');

class TestPlugin extends Plugin{
	constructor(){
		super("TestPlugin")
	}
	
	onEvent(eventType, event){
		console.log(eventType, event);
	}
}

module.exports = TestPlugin;
