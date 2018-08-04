const Rx = require('rxjs');
const readline = require('readline');
const process = require('process');

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

class KeyObservable {
	
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

module.exports = KeyObservable;
