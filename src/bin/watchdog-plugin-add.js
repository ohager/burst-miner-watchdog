#!/usr/bin/env node
require('module-alias/register');
const args = require('args');
const isEmpty = require('lodash/isEmpty');

function validateType(v){
	
	if(["handler", "explorer", "miner-process", "miner-observable"].indexOf(v) === -1){
		console.error(`Unknown plugin type [${v}]`);
		process.exit(-1);
	}
	
	return v;
}

const required = (option) => (initFb) => (v) => {
	if(isEmpty(v)){
		console.error(`[${option}] is mandatory`);
		process.exit(-1);
		return;
	}
	
	return initFb ? initFb(v) : v;
};

args.option("type", "The plugin type", "handler", required("type")(validateType))
	.option("name", "The name of the plugin", "", required("name")())
	.option("src", "The name of the folder where your plugin sources are located", "./", required("src")());

const options = args.parse(process.argv, {version: false});

console.log("plugin-add", options);


