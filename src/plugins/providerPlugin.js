
class ProviderPlugin {
	constructor(name){
		this.__name = name;
	}
	
	get name(){ return this.__name};
	
	provide(){
		throw `provide() method is not implemented by Provider Plugin '${this.name}'`;
	}
}

module.exports = ProviderPlugin;
