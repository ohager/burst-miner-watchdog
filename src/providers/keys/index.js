const KeyListener = require('./keyListener');

function provider() {
	return new KeyListener().listen();
}

module.exports  = provider;
