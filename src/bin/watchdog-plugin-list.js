#!/usr/bin/env node
require('module-alias/register');
const listCommand = require('./plugin/list');

listCommand();

