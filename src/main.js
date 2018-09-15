require('module-alias/register');

const path = require('path');
const options = require('@/options');
const config = require('@/config');
const pluginLoader = require('@/pluginLoader');
const WatchDog = require('@/watchdog');

const configuration = config.load(options.config);
const plugins = pluginLoader.load(path.join(__dirname, './plugins'), configuration);

const watchdog = new WatchDog(plugins);
watchdog.run();






