const path = require("path");

const PluginTypes = {
	HANDLER : "handler",
	EXPLORER: "explorer",
	MINER_PROCESS: "miner-process",
	MINER_OBSERVABLE: "miner-observable",
};

const PathAlias = {
	Plugins : path.join(__dirname, "../../plugins"),
};

module.exports = {
	PluginTypes,
	PathAlias
};
