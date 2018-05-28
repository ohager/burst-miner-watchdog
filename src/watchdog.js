const ExplorerListener = require('./explorerListener');
const WebSocketListener = require('./websocketListener');
const MinerProcess = require('./minerProcess');
const keyListener = require('./keyListener');
const config = require('./config');
const {writeInfo, writeWarning, writeError} = require('./utils');
const eventStreamHandler = require('./eventStreamHandler');
const state = require('./state');

const minerProcess = new MinerProcess(config.MinerExe);
const explorerListener = new ExplorerListener(config.ExplorerApiUrl);
const socketListener = {
	miner: new WebSocketListener(config.MinerWebsocketUrl, 'miner'),
	pool: new WebSocketListener(config.PoolWebsocketUrl, 'pool')
};

function isSocketMessageEvent(name) {
	return (e) => e[name] && e[name].type === 'message';
}

function isUnexpectedSocketCloseEvent({name, event}) {
	const e = event[name];
	if (e && e.type === 'close' && e.type !== 1000) {
		writeWarning("Unexpected connection loss...reconnecting");
		setTimeout(listenSocket.bind(null, name), 3000);
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
			event: e
		}))
		.filter(isSocketMessageEvent(name))
		.subscribe(eventStreamHandler);
}

function errorStreamHandler(e) {
	writeError(`Explorer Fetch Error: ${e}`);
	writeInfo("Restarting Explorer");
	setTimeout(listenExplorer, 3000);
}

function listenExplorer() {
	const name = 'explorer';
	explorerListener.start()
		.map(d => ({[name]: d}))
		.subscribe(eventStreamHandler, errorStreamHandler);
}

async function exit() {
	writeInfo("Exiting Watchdog...", "[BYE]");
	await minerProcess.stop();
	process.exit(0);
}


function printState() {
	writeInfo(`\n\n${JSON.stringify(state.get(), null, 4)}\n`, "[STATE]");
}

keyListener.listen()
	.filter(({name, sequence}) => name === 'escape' || sequence === '\u0003')
	.subscribe(exit);

keyListener.listen()
	.filter(({name}) => name === 's')
	.subscribe(printState);


async function initialize() {
	
	writeInfo("Initializing watchdog...");
	const isRunning = await minerProcess.isRunning();
	await minerProcess.start();
	// start socket listener delayed, to guarantee that miner doesn't shut down
	setTimeout(() => listenSocket('miner'), 2000);
	listenSocket('pool');
	listenExplorer();
}

initialize();
