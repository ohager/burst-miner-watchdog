const Plugin = require('../plugin');

class TestPlugin2 extends Plugin{
	constructor(){
		super("TestPlugin2")
	}
	
	onEvent(eventType, event){
		console.log(this.name, eventType, event);
	}
}

module.exports = TestPlugin2;
