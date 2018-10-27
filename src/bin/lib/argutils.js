const isEmpty = require('lodash/isEmpty');

const required = (options, requiredArgs, invalidCallback = () => {}) => {
	let isValid = true;
	requiredArgs.forEach(a => {
		if (isEmpty(options[a])) {
			console.error(`\n[${a}] is mandatory\n`);
			isValid = false;
		}
	});
	
	if (!isValid) {
		invalidCallback();
	}
};

module.exports = {
	required
};
