# burst-miner-watchdog

> Work in progress - not ready yet

A watchdog for Burst creepMiner, i.e. a tool to keep your BURST mining running. 

For several reasons, it could happen that your miner stops working, e.g. network failures, I/O failures, etc.
I also had scenarios that the most recent version of creepMiner stopped working/hangs, without any obvious reason.
The watchdog listens to creepMiner's activity and compares with current state of the BURST network. 
In case of divergent block heights, or missing miner responses, the watchdog restarts the miner.
