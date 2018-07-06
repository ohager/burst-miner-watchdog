const Rx  = require('rxjs');
const {filter, pluck} = require('rxjs/operators');

const connectionError = Rx.pipe(
	pluck('error', 'errno'),
	filter(e => e === 'ECONNREFUSED'),
);

module.exports = {
	connectionError
};
