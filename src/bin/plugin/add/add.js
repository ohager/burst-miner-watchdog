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

function overwriteExistingPlugin(srcDir, targetDir) {
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
		fs.copySync(srcDir, targetDir, {overwrite: true});
	})
}

function validateSourceDir(src) {
	
	if (!fs.pathExistsSync(src)) {
		throw `Source Directory could not be found: ${src}`;
	}
	
	const stats = statSync(src);
	if (!stats.isDirectory()) {
		throw `${src} is not a directory`;
	}
	
}

function add({type, name, src}) {
	
	const targetDir = path.join(getTypeDir(type), name);
	
	validateSourceDir(src);
	validatePlugin(path.join(process.cwd(), src), type);
	
	if (fs.pathExistsSync(targetDir)) {
		overwriteExistingPlugin(src, targetDir);
	}
	else {
		fs.ensureDirSync(targetDir);
		fs.copySync(src, targetDir);
	}
}


module.exports = add;
