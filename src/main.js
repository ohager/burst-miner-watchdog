require('module-alias/register');
const path = require('path');
const args = require('args');
const config = require('@/config');
const pluginLoader = require('@/pluginLoader');
const WatchDog = require('@/watchdog');

args.option("config", "The configuration file to be used", path.join(__dirname, "../config.json"));

const options = args.parse(process.argv);
const configuration = config.load(options.config);
const plugins = pluginLoader.load(path.join(__dirname, './plugins'), configuration);

const watchdog = new WatchDog(plugins);
watchdog.run();






