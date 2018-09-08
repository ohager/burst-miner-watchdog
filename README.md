# burst-miner-watchdog

> Work in progress - not ready yet

A watchdog for Burst miner (currently for creepMiner, but easily extinsible), i.e. a tool to keep your BURST mining running. 

## Motivation

For several reasons, it could happen that your miner stops working, e.g. network failures, I/O failures, etc.
I also had scenarios that creepMiner stopped working/hangs, without any obvious reason.
The watchdog listens to the miner's activity and compares with current state of the BURST network. 
In case of divergent block heights, or missing miner responses, the watchdog restarts the miner.

## Plugin Architecture

The watchdog itself is architectured as a _backbone_, which allows plugging in arbitrary event handlers and providers.

### Event Handlers

TO DO

### Providers

TO DO

