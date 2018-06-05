const Logger = require('./logger');

function provider() {
	return new Logger();
}

module.exports  = provider;
