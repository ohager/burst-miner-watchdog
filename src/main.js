const fs = require('fs');
const path = require('path');
const args = require('args');
const state = require('./state');
const WatchDog = require('./watchdog');

args.option("config", "The configuration file to be used", path.join(__dirname, "../config.json"));

const options = args.parse(process.argv);
const configObj = JSON.parse(fs.readFileSync(options.config, 'utf8'));

state.updateConfig(configObj);

const instance = new WatchDog();
instance.run();






