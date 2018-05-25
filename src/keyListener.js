const readline = require('readline');

class KeyListener {
	
	constructor() {
		this.keyMap = {};
		readline.emitKeypressEvents(process.stdin);
		process.stdin.setRawMode(true);
		process.stdin.on('keypress', async (str, key) => {
			const handler = this.keyMap[key.name] || this.keyMap[key.sequence];
			if(handler){
				handler.call(null);
			}
		});
	}
	
	onEscape(cb){
		this.on('escape', cb);
		return this;
	}

	onControlC(cb){
		this.on('\u0003', cb);
		return this;
	}
	
	on(keyName, cb){
		this.keyMap[keyName] = cb;
		return this;
	}
}

module.exports = new KeyListener();
