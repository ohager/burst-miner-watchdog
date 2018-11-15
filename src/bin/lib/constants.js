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

const PluginTypeDirs = {
	[PluginTypes.HANDLER]: path.join(PathAlias.Plugins, '/handler'),
	[PluginTypes.EXPLORER]: path.join(PathAlias.Plugins, '/providers/explorer'),
	[PluginTypes.MINER_OBSERVABLE]: path.join(PathAlias.Plugins, '/providers/miner/observable'),
	[PluginTypes.MINER_PROCESS]: path.join(PathAlias.Plugins, '/providers/miner/process'),
};


module.exports = {
	PluginTypes,
	PathAlias,
	PluginTypeDirs,
};
