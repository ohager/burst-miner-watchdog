const path = require('path');
const args = require('args');

function customCommandInit(name, sub, options){
	const command = require(`@/commands/${name}`);
	command.exec(sub, options)
}

args.option("config", "The configuration file to be used", path.join(__dirname, "../config.json"))
	.command("plugin", "Commands to manage plugin");


module.exports = args.parse(process.argv);
