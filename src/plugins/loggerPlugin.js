const Plugin = require('@/plugin');
const {writeWarning, writeSuccess, writeError} = require('@/utils');

const blockString = e => `Blocks - Miner: ${e.miner}, Explorer: ${e.explorer}`;
const logBlockEvent = e => writeSuccess(`${blockString(e)}`, '[✓]');
const logBehindExplorer = e => writeWarning(`Miner Block is less than Explorer:\n${blockString(e)}`);
const logCloseEvent = () => writeWarning(`miner has closed connection...`);


class LoggerPlugin extends Plugin{
	constructor(){
		super("Logger")
	}
	
	onEvent(eventType, event){
		this[eventType](event);
	}
	
	onMinerError(e){
		writeError(`We have a problem:\n\t${message}`);
	}
	
	onMinerClose(e){
		writeWarning(`Miner has closed connection...`);
	}
	
	onMinerStuck(e){
		writeWarning(`Miner Block is less than Explorer:\n${blockString(e)}`)
	}

	onMinerBlock(e){
	}
	
	onExplorerBlock(e){
	
	}

	onNewBlock(e){
		console.log(e);
		writeSuccess(`${blockString(e)}`, '[✓]')
	}
	
	onRestart(){
	
	}

	onStart(){
	
	}

	onExit(){
	
	}

	onKey(){
	
	}

}

module.exports = LoggerPlugin;
