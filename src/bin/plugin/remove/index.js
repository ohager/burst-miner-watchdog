const fs = require('fs-extra');
const inquirer = require('inquirer');
const path = require("path");
const isEmpty = require("lodash/isEmpty");
const {PluginTypeDirs, PluginTypes} = require("../../lib/constants");

const getTypeDir = (type) => {
	const dir = PluginTypeDirs[type];
	if (!dir) throw `Unknown Plugin Type: ${type}`;
	
	return dir;
};

const getTypeNames = () => Object.keys(PluginTypes).map(k => PluginTypes[k]);

function removeExistingPlugin(targetDir) {
	inquirer.prompt([
		{
			type: 'confirm',
			name: 'remove',
			message: `Do you really want to remove the plugin ${targetDir}?`,
			default: false
		},
	]).then(({overwrite: remove}) => {
		if (remove) {
			console.log("Removal aborted!");
			return;
		}
		console.log("Removing...");
		fs.removeSync(targetDir);
	})
}

async function removePlugin(opts) {
	
	const answers = await inquirer.prompt([
		{
			type: 'list',
			name: 'type',
			message: 'What type of plugin do you want to remove?',
			choices: getTypeNames(),
			default: PluginTypes.HANDLER,
			when: () => isEmpty(opts.type),
		},
		{
			type: 'input',
			name: 'name',
			message: 'What is the name of the plugin to be removed?',
			default: 'myAwesome',
			when: () => isEmpty(opts.name),
		},
	]);
	
	const params = {
		...opts,
		...answers
	};
	
	const targetDir = path.join(getTypeDir(params.type), params.name);
	
	if (!fs.pathExistsSync(targetDir)) {
		throw `No Plugin found at '${targetDir}'`;
	}

	removeExistingPlugin(targetDir);
}


module.exports = removePlugin;
