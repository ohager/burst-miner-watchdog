const path = require('path');
const fs = require('fs');
const Ajv = require('ajv');
const {highlight} = require('cli-highlight');
const args = require('args');
const config = require('./config');
const WatchDog = require('./watchdog');

args.option("config", "The configuration file to be used", path.join(__dirname, "../config.json"));

const options = args.parse(process.argv);

config.load(options.config);

const instance = new WatchDog();
instance.run();






