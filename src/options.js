const path = require('path');
const args = require('args');

args.option("config", "The configuration file to be used", path.join(__dirname, "../config.json"))
	.command("plugin", "Commands to manage plugin");


module.exports = args.parse(process.argv);
