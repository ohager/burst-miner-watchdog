# Plugin Development

So, you gonna develop a plugin for the burst-miner-watchdog. Awesome. Thank you for your support.

## Prerequisites

To develop a plugin for the burst-miner-watchdog, you need the watchdog already installed.
This is, _nodejs_ should be installed implicitely.

Nothing more. 

## Startup

You have already executed something like this?!

`watchdog plugin create --type handler --name myAwesomePlugin`

So, you should see a node project build into your current directory

### Install plugin

If you really used the plugin creator command you only need two steps:

1. Build your plugin: `npm run build`
2. Add your plugin: `watchdog plugin add -t <pluginType> -n <pluginName>`
3. Eventually, reconfigure watchdog to load your plugin

Oh, three steps... I lied, sorry!

