#!/usr/bin/env node

const R = require('ramda');
const build = require('../src/build');

const configPath = process.argv[2]
  ? process.cwd() +
    '/' +
    R.replace(/^\.?\/?/, '', process.argv[2])
  : process.cwd() + '/picompiler.config.js';

const config = require(configPath);

build(config);
