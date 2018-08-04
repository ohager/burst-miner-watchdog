const {filter} = require('rxjs/operators');

const isKey = (k) => ({name}) => name === k;
const isSequence = (s) => ({sequence}) => sequence === s;

const key = (k) => filter(isKey(k));
const sequence = (s) => filter(isSequence(s));
const exitKey = filter((e) => isKey('escape')(e) || isSequence('\u0003')(e));

const forKey = k => (fn, ctx = null) => ({name, sequence}) => (name === k || sequence === k) && fn.call(ctx);

module.exports = {
	forKey,
	exitKey,
	key,
	sequence,
};
