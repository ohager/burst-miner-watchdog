const fs = require('fs');
const args = require('args');
const WatchDog = require('./watchdog');

args.option("config", "The configuration file to be used", "config.json");

const options = args.parse(process.argv);

console.log(options);

const configObj = JSON.parse(fs.readFileSync(options.config, 'utf8'));

console.log(configObj);


const instance = new WatchDog(configObj);
instance.run();






