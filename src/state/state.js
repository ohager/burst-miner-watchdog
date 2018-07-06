const StappoClass = require('stappo');
const {format} = require('date-fns');
const stappo = new StappoClass();

function timestamped(obj, fieldName = 'dateTime') {
	return {
		[fieldName] : format(new Date()),
		...obj
	}
}
// initialize
stappo.update(() => ({
		config: {
			logger : {
				enabled : true,
				level : 'debug'
			}
		},
		miner: timestamped({
			blockHeight: null,
		}),
		explorer: timestamped({
			blockHeight: null,
		}),
		restart: timestamped({
			count: 0,
		}),
		error: timestamped({
			count: 0,
			exception : '',
		})
	})
);

module.exports = {
	state: stappo,
	timestamped
};
