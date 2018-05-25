const axios = require('axios');

class ExplorerAPI {
	constructor(baseUrl){
		this.baseUrl = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
	}
	
	async getLastBlocks() {
		const response = await axios.get(this.baseUrl + 'last_blocks');
		return response.data.data.blocks || [];
	}
}

module.exports =  ExplorerAPI;
