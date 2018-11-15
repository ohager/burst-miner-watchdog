const fs = require('fs-extra');
const {statSync} = require('fs');
const inquirer = require('inquirer');
const path = require("path");
const {PathAlias, PluginTypes} = require("../../lib/constants");

const PLUGIN_ROOT_DIR = path.join(__dirname, PathAlias.Plugins)

const DirsPerType = {
	[PluginTypes.HANDLER]: '/handler',
	[PluginTypes.EXPLORER]: '/providers/explorer',
	[PluginTypes.MINER_OBSERVABLE]: '/providers/miner/observable',
	[PluginTypes.MINER_PROCESS]: '/providers/miner/process',
};


const getTypeDir = (type) => {
	const dir = DirsPerType[type];
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
		console.log("Overwriting...");
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

function addPlugin({type, name, src}) {
	
	const targetDir = path.join(PathAlias.Plugins, getTypeDir(type), name);
	
	validateSourceDir(src);
	if (!fs.pathExistsSync(src)) {
		throw `Could not find ${src}`
	}
	
	if (fs.pathExistsSync(targetDir)) {
		overwriteExistingPlugin(src, targetDir);
	}
	else {
		fs.ensureDirSync(targetDir);
		fs.copySync(src, targetDir);
	}
}


module.exports = addPlugin;
