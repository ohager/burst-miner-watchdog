
class Plugin {
	constructor(name){
		this.name = name;
	}
	
	onEvent(){
		console.warn(`onEvent method is not implemented by custom Plugin '${this.name}'`)
	}
}

module.exports = Plugin;
