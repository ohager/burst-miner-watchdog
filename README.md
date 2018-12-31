# burst-miner-watchdog

> In favor of [Aspera](https://github.com/PoC-Consortium/Aspera) I lower this projects priority...

> Work in progress - not ready yet

A watchdog for Burst miner (currently for creepMiner, but easily extensible), i.e. a tool to keep your BURST mining running. 

## Motivation

For several reasons, it could happen that your miner stops working, e.g. network failures, I/O failures, etc.
I also had scenarios that creepMiner stopped working/hangs, without any obvious reason.
The watchdog listens to the miner's activity and compares with current state of the BURST network. 
In case of divergent block heights, or missing miner responses, the watchdog restarts the miner.

## Plugin Architecture

The watchdog itself is architectured as a _backbone_, which allows plugging in arbitrary event handlers and providers.
The _backbone_ just cares about the internal workflow, i.e. checks if a miner got stuck and try to restart it, while he dispatches 
certain events, which are delegated to plugged in __handlers__. A watchdog may have plugged in as much handlers as the computer can handle.
In contrast to handlers, __providers__ can be considered as event sources, which feed the workflow. The watchdog needs 
exactly one instance of each of the three types, which are
- Explorer: Provides the _recently mined block_ of the BurstCoin blockchain
- Miner Process: Provides access to the mining process, such that it can be stopped and/or started
- Miner Observable: Provides the _current block that is being mined_

```

Explorer o --\    Handler Handler
              \      |      |
Observable o --------|-backbone-----|--- ...
             /          |           |
Process o --/        Handler     Handler

```

## Plugin Management

The watchdog comes with an extensive toolset to manage the plugins. 

Type `watchdog-plugin --help` to see all supported options and commands.

Type `watch-plugin-(command) --help` to see further help for specific sub-commands.

### Commands

- `watchdog plugin list` shows all installed plugins
- `watchdog plugin remove` removes a plugin
- `watchdog plugin add` adds a plugin
- `watchdog plugin create` creates a plugin stub
- `watchdog plugin simulate` runs a backbone simulation, which allows plugin testing (WiP)

#### Plugin Development
For sake of simplicity, the plugin tool can create a plugin stub. 
To create a handler plugin you may run the following commands.

1. `watchdog plugin create -t handler -n myHandler` - Creates a directory called _myHandler_ in your current path, that contains a node project with everything you need to start coding.
2. `npm install` or `yarn` - Before coding, you need to install all dependencies
3. `npm run build` or `yarn build` - Once written you should build the project, i.e. bundles the project into the `./dist` folder 
4. `watchdog plugin add -t handler -n myHandler -s ./dist` - Adds the plugin as _handler_ to the watchdog. When starting the watchdog the plugin should be available now.



