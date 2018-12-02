const exep = require('./executeAsync');
const packageJson = require('../package.json');

const npm = (args) => exep('cmd.exe', ['/c', 'npm'].concat(args));

const pack = () => npm(['pack'])
	.then(() => {
		const {name, version} = packageJson;
		const packageName = `${name}-${version}.tgz`;
		return Promise.resolve(packageName);
	});

const install = (packageName) => npm(['install', '-g', packageName]);

(function () {
	
	pack()
		.then(install)
		.catch(e => {
			console.error("FUCK, didn't work: " + e);
		});
})();
