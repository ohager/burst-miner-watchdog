const {readdirSync} = require("fs");
const {join} = require("path");
const {PathAlias} = require("../../lib/constants");

const prettifyFilename =  name => name.replace(".js", "");

function listPlugins(type){
	const handlerDir = join(PathAlias.Plugins, type);
	const fileNames = readdirSync(handlerDir);
	console.log(fileNames.map(prettifyFilename));
}

function listPlugin(){
	console.info("Handler Plugins:");
	listPlugins("handler");
	
	console.info("\nExplorer Plugins:");
	listPlugins("providers/explorer");
	
	console.info("\nMiner Observable Plugins:");
	listPlugins("providers/miner/observable");

	console.info("\nMiner Process Plugins:");
	listPlugins("providers/miner/process");
}

module.exports = listPlugin;
