
class HandlerPlugin {
	constructor(name){
		this.name = name;
	}
	
	onEvent(){
		throw `onEvent() method is not implemented by custom Plugin '${this.name}'`
	}
}

module.exports = HandlerPlugin;
