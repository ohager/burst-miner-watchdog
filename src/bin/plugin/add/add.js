const fs = require('fs-extra');
const isEmpty = require("lodash/isEmpty");
const {statSync} = require('fs');
const inquirer = require('inquirer');
const path = require('path');
const {PluginTypeDirs, PluginTypes} = require('../../lib/constants');
const validatePlugin = require('./validate');

const getTypeDir = (type) => {
	const dir = PluginTypeDirs[type];
	if (!dir) throw `Unknown Plugin Type: ${type}`;
	
	return dir;
};

const getTypeNames = () => Object.keys(PluginTypes).map(k => PluginTypes[k]);

function copyPlugin(srcPath, targetDir, opts) {
	const srcStats = statSync(srcPath);
	const srcDir = srcStats.isDirectory() ? srcPath : path.dirname(srcPath);
	fs.copySync(srcDir, targetDir, opts);
}

function overwriteExistingPlugin(srcPath, targetDir) {
	inquirer.prompt([
		{
			type: 'confirm',
			name: 'overwrite',
			message: 'Plugin already exists! Do you want to overwrite it?',
			default: false
		},
	]).then(({overwrite}) => {
		if (!overwrite) return;
		console.log('Overwriting...');
		copyPlugin(srcPath, targetDir, {overwrite: true});
	})
}


function addPlugin({type, name, src}) {
	
	const targetDir = path.join(getTypeDir(type), name);
	
	validatePlugin(path.join(process.cwd(), src), type);
	
	if (fs.pathExistsSync(targetDir)) {
		overwriteExistingPlugin(src, targetDir);
	}
	else {
		copyPlugin(src, targetDir);
	}
}

async function add(opts) {
	
	const answers = await inquirer.prompt([
		{
			type: 'list',
			name: 'type',
			message: 'What type of plugin do you want to add?',
			choices: getTypeNames(),
			default: PluginTypes.HANDLER,
			when: () => isEmpty(opts.type),
		},
		{
			type: 'input',
			name: 'name',
			message: 'What will be the name of your plugin?',
			default: 'myAwesome',
			when: () => isEmpty(opts.name),
		},
		{
			type: 'input',
			name: 'src',
			message: 'Where are your sources located?',
			default: './',
			when: () => isEmpty(opts.src),
		},
	]);
	
	addPlugin({
		...opts,
		...answers
	})
}

module.exports = add;
