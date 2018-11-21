#!/usr/bin/env node
require('module-alias/register');
const simulateCommand = require('./plugin/simulate');

(async function () {
	try {
		await simulateCommand();
		
	} catch (e) {
		console.error(e);
		process.exit(-1)
	}
})();

