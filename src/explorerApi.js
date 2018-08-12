const axios = require('axios');
const {orderBy, last} = require('lodash');

class ExplorerAPI {
	constructor(baseUrl) {
		this.baseUrl = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
	}
	
	async getLastBlock() {
		const response = await axios.get(this.baseUrl + 'last_blocks');
		const lastBlocks = response.data.data.blocks || [];
		const orderedBlocks = orderBy(lastBlocks, 'height');
		return last(orderedBlocks);
	}
}

module.exports = ExplorerAPI;
