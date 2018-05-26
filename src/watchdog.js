const Rx = require('rxjs');
const ExplorerListener = require('./explorerListener');
const MinerListener = require('./minerListener');
const keyListener = require('./keyListener');
const config = require('./config');
const {writeInfo, wait} = require('./utils');
const handler = require('./handler');

const minerListener = new MinerListener(config.MinerWebsocketUrl);
const explorerListener = new ExplorerListener(config.ExplorerApiUrl);

const $events = Rx.Observable
	.merge(
		minerListener.start().map(d => ({miner: d.data})),
		explorerListener.start().map(d => ({explorer: d}))
	);

async function exit() {
	writeInfo("Stopping listener...");
	await minerListener.stop();
	//await wait(2000);
	process.exit(0);
}

keyListener.start()
	.filter(({name, sequence}) => name === 'escape' || sequence === '\u0003')
	.subscribe(exit);


$events.subscribe(handler);

