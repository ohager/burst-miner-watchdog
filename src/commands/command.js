const {head, tail} = require("lodash");

module.exports = class Command {
	exec(sub, options) {
		throw "Implement exec";
	}
};
