const Rx = require('rxjs');
const ExplorerListener = require('./explorerListener');
const WebSocketListener = require('./websocketListener');
const keyListener = require('./keyListener');
const config = require('./config');
const {writeInfo, writeWarning} = require('./utils');
const dataStreamHandler = require('./dataStreamHandler');

const explorerListener = new ExplorerListener(config.ExplorerApiUrl);

const socketListener = {
	miner : new WebSocketListener(config.MinerWebsocketUrl, 'miner'),
	pool : new WebSocketListener(config.PoolWebsocketUrl, 'pool')
};

function isSocketMessageEvent(name) {
	return (e) => e[name] && e[name].type === 'message';
}

function isUnexpectedSocketCloseEvent({name, event, restart}) {
	const e = event[name];
	if (e && e.type === 'close' && e.type !== 1000) {
		writeWarning("Unexpected connection loss...reconnecting");
		setTimeout(restart, 3000);
		return true;
	}
	return false;
}

function listenSocket(name) {
	socketListener[name]
		.start()
		.map(d => ({[name]: d}))
		.takeWhile(e => !isUnexpectedSocketCloseEvent({
			name: name,
			restart: listenSocket.bind(null, name),
			event: e
		}))
		.filter(isSocketMessageEvent(name))
		.subscribe(dataStreamHandler);
}

function exit() {
	writeInfo("Exiting Watchdog...");
	process.exit(0);
}

function listenExplorer() {
	const name = 'explorer';
	explorerListener.start()
		.map(d => ({[name]: d}))
		.subscribe(dataStreamHandler);
}

keyListener.start()
	.filter(({name, sequence}) => name === 'escape' || sequence === '\u0003')
	.subscribe(exit);

listenSocket('miner');
listenSocket('pool');
listenExplorer();
