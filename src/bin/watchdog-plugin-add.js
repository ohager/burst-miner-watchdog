#!/usr/bin/env node
require('module-alias/register');
const args = require('args');
const isEmpty = require('lodash/isEmpty');

function validateType(v){
	
	if(isEmpty(v)){
		console.error("type is required");
		process.exit(-1)
	}
	
	if(["handler", "explorer", "miner-process", "miner-observable"].indexOf(v) === -1){
		console.error(`Unknown plugin type [${v}]`);
		process.exit(-1);
	}
}

args.option("type", "The plugin type", "handler", validateType)
	.option("name", "The name of the plugin")
	.option("dir", "The name of the folder where the plugins sources are", "./");

const options = args.parse(process.argv, {version: false});

console.log("plugin-add", options);
