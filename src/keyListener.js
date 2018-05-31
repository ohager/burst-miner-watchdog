const Rx = require('rxjs');
const readline = require('readline');

class KeyListener {
	
	constructor() {
		readline.emitKeypressEvents(process.stdin);
		process.stdin.setRawMode(true);
	}
	
	listen() {
		return Rx.Observable.fromEventPattern(
			(handler) => {
				process.stdin.on('keypress', handler)
			},
			(handler) => {
				process.stdin.removeListener('keypress', handler)
			},
			(str, {name, sequence}) => {
				return {name, sequence}
			}
		);
	}
	
}

module.exports = KeyListener;
