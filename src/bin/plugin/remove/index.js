const fs = require('fs-extra');
const {statSync} = require('fs');
const inquirer = require('inquirer');
const path = require("path");
const {PluginTypeDirs} = require("../../lib/constants");

const getTypeDir = (type) => {
	const dir = PluginTypeDirs[type];
	if (!dir) throw `Unknown Plugin Type: ${type}`;
	
	return dir;
};

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
function removePlugin({type, name}) {
	
	const targetDir = path.join(getTypeDir(type), name);
	
	if (!fs.pathExistsSync(targetDir)) {
		throw `No Plugin found at '${targetDir}'`;
	}

	removeExistingPlugin(targetDir);
}


module.exports = removePlugin;
