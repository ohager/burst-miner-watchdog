const {pipe}= require('rxjs');
const {filter, pluck} = require('rxjs/operators');

const connectionError = pipe(
	pluck('error', 'errno'),
	filter(e => e === 'ECONNREFUSED'),
);

module.exports = {
	connectionError
};
