const path = require("path");


const PLUGIN_ROOT_DIR = path.join(__dirname, ..)

function addPlugin(){
	console.log("addPlugin");
};

module.exports = addPlugin;
