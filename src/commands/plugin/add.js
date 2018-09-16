const Command = require("../command");

class PluginAddCommand extends Command {
	exec(options){
		
		console.log("PluginAddCommand", options);
		
	}
}

module.exports = new PluginAddCommand();
