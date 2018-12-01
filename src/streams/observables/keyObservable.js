const process = require('process');
const Rx = require('rxjs');
const readline = require('readline');

class KeyObservable {
	
	constructor(){
		readline.emitKeypressEvents(process.stdin);
		process.stdin.setRawMode(true);
	}
	
	get() {
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

module.exports = new KeyObservable();
