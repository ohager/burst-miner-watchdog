const path = require('path');
const {spawn} = require('child_process');

const objToArray = (obj) => Object.keys(obj).reduce((acc, arg) => {
	acc.push(obj[arg]);
	return acc;
}, []);

const exep = (cmd, args, opts) => new Promise((resolve, reject) => {
	console.log(`Executing ${cmd} ${args.join(" ")}`);
	const process = spawn(cmd, args, opts);
	process.on('close', (code) => {
		if (code !== 0) {
			reject("Ooops, something failed");
		}
		else {
			resolve();
		}
	})
});

const watchdog = function () {
	const watchdogPath = path.join(__dirname, '../../watchdog.js');
	const configFile = path.join(__dirname, './simulator.config.json');
	return exep('node', [
			watchdogPath,
			`--config ${configFile}`
		],
		{stdio: 'inherit'})
};

async function simulate(opts) {
	await watchdog();
	
}

module.exports = simulate;
