const readline = require('readline');
const process = require('process');
const {fromEventPattern}= require('rxjs');

/**
 * Creates an observable event stream (rxjs) of key strokes
 */
class KeyObservable {
	
	constructor(){
		readline.emitKeypressEvents(process.stdin);
		process.stdin.setRawMode(true);
	}
	
	/**
	 * Get key stroke observable
	 * @example
	 * key event structure
	 * { name, sequence }
	 *
	 * @returns {*} An observable stream of key strokes
	 */
	get() {
		return fromEventPattern(
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
