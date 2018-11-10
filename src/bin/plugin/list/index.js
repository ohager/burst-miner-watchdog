const {readdirSync} = require("fs");
const {join} = require("path");
const {PathAlias} = require("../../lib/constants");


function listHandlerPlugins(){
	const handlerDir = join(PathAlias.Plugins, "handler");
	const fileNames = readdirSync(handlerDir);
	console.log(fileNames.map(name => name.replace(".js", "")));
}

function listPlugin(){
	listHandlerPlugins()
}

module.exports = listPlugin;
