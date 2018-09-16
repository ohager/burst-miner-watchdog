const Command = require("../command");

class PluginRemoveCommand extends Command {
	exec(options){
		console.log("PluginRemoveCommand", options);
	}
}

module.exports = new PluginRemoveCommand();
