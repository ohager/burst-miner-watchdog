const {camelCase, template} = require('lodash');
const fs = require('fs-extra');
const {readFileSync, writeFileSync} = require('fs');
const inquirer = require('inquirer');
const path = require('path');
const {PluginTypes} = require('../../lib/constants');

const TemplateRootDir = path.join(__dirname, 'templates');


function compileFile(type, srcFilePath, data, targetDir, targetFileName) {
	const srcDir = path.join(TemplateRootDir, type);
	const templateFilePath = path.join(srcDir, srcFilePath);
	const templateCode = readFileSync(templateFilePath);
	const compile = template(templateCode);
	const code = compile(data);
	fs.remove(path.join(targetDir, srcFilePath));
	const outputFilePath = path.join(targetDir, 'src', targetFileName);
	writeFileSync(outputFilePath, code);
	
}

function createHandler(targetDir, name) {
	
	const pluginName = camelCase(name) + 'Plugin';
	compileFile(
		'handler',
		'src/handler.template.js', {
			pluginName,
			name,
		}, targetDir,
		pluginName + '.js');
	
	compileFile(
		'handler',
		'src/index.template.js', {
			plugin : pluginName + '.js',
		}, targetDir,
		'index.js');
	
}

function createExplorer() {
	console.log("createExplorer")
}

function createMinerObservable() {
	console.log("createMinerObservable")
}

function createMinerProcess() {
	console.log("createMinerProcess")
}

const TypeCreators = {
	[PluginTypes.HANDLER]: createHandler,
	[PluginTypes.EXPLORER]: createExplorer,
	[PluginTypes.MINER_OBSERVABLE]: createMinerObservable,
	[PluginTypes.MINER_PROCESS]: createMinerProcess,
};

function create(targetDir, type, name) {
	console.info("Creating plugin stub");
	console.info("type:", type);
	console.info("name:", name);
	
	TypeCreators[type](targetDir, name);
}


function createPlugin({type, name}) {
	
	const targetDir = path.join(process.cwd(), camelCase(name));
	
	if (fs.pathExistsSync(targetDir)) {
		throw `Path ${targetDir} already exists. Please, choose another name`;
	}
	
	create(targetDir, type, name);
}


module.exports = createPlugin;
