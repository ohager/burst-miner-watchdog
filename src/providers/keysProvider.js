const KeyObservable = require('@streams/observables/keyObservable');

function provider() {
	return new KeyObservable().get();
}

module.exports  = provider;
