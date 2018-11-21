const {camelCase, template, isEmpty} = require('lodash');
const fs = require('fs-extra');
const {readFileSync, writeFileSync} = require('fs');
const inquirer = require('inquirer');
const path = require('path');
const {PluginTypes} = require('../../lib/constants');

const TemplateRootDir = path.join(__dirname, 'templates');

const getTypeNames = () => Object.keys(PluginTypes).map(k => PluginTypes[k]);

function generateFileFromTemplate(type, templateFileName, data, targetDir, targetFileName) {
	const srcDir = path.join(TemplateRootDir, type);
	const templateFilePath = path.join(srcDir, templateFileName);
	const templateCode = readFileSync(templateFilePath);
	const compile = template(templateCode);
	const code = compile(data);
	fs.remove(path.join(targetDir, templateFileName));
	const outputFilePath = path.join(targetDir, targetFileName);
	writeFileSync(outputFilePath, code);
	
}

function createHandler(targetDir, name) {
	
	const pluginName = camelCase(name) + 'Plugin';
	const srcDir = path.join(TemplateRootDir, 'handler');
	fs.copySync(srcDir, targetDir);
	
	generateFileFromTemplate(
		'handler',
		'src/handler.template.js', {
			pluginName,
			name,
		},
		targetDir,
		`./src/${pluginName}.js`);
	
	generateFileFromTemplate(
		'handler',
		'./index.template.js', {
			plugin: pluginName + '.js',
		},
		targetDir,
		'index.js');
	
	generateFileFromTemplate(
		'handler',
		'package.template.json', {
			name,
		},
		targetDir,
		'package.json');
	
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

async function createPlugin(opts) {
	
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
	]);
	
	const params = {
		...opts,
		...answers
	};
	
	const targetDir = path.join(process.cwd(), camelCase(params.name));
	
	if (fs.pathExistsSync(targetDir)) {
		throw `Path ${targetDir} already exists. Please, choose another name`;
	}
	
	create(targetDir, params.type, params.name);
}


module.exports = createPlugin;
