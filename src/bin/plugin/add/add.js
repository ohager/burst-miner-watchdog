const fs = require('fs-extra');
const {statSync} = require('fs');
const inquirer = require('inquirer');
const path = require('path');
const {PluginTypeDirs} = require('../../lib/constants');
const validatePlugin = require('./validate');

const getTypeDir = (type) => {
	const dir = PluginTypeDirs[type];
	if (!dir) throw `Unknown Plugin Type: ${type}`;
	
	return dir;
};

function copyPlugin(srcPath, targetDir, opts){
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
		copyPlugin(srcPath, targetDir, {overwrite:true});
	})
}

function add({type, name, src}) {
	
	const targetDir = path.join(getTypeDir(type), name);
	
	validatePlugin(path.join(process.cwd(), src), type);
	
	if (fs.pathExistsSync(targetDir)) {
		overwriteExistingPlugin(src, targetDir);
	}
	else {
		copyPlugin(src, targetDir);
	}
}


module.exports = add;
