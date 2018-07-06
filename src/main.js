require('module-alias/register');

const path = require('path');
const args = require('args');
const config = require('@/config');
const WatchDog = require('@/watchdog');

const providers = require('@/providers');

args.option("config", "The configuration file to be used", path.join(__dirname, "../config.json"));

const options = args.parse(process.argv);

config.load(options.config);

const instance = new WatchDog(providers);
instance.run();






