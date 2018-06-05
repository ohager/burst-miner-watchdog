const Rx  = require('rxjs');
const {filter} = require('rxjs/operators');

const isKey = (k) => ({name}) => name === k;
const isSequence = (s) => ({sequence}) => sequence === s;

const key = (k) => filter(isKey(k));
const sequence = (s) => filter(isSequence(s));

const exitKey = Rx.pipe(
	key('escape'),
	sequence('\u0003')
) ;

module.exports = {
	exitKey,
	key,
	sequence,
};
