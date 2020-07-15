#!/usr/bin/env node

const R = require('ramda');
const build = require('../src/build');

const getConfigPath = require('../src/getConfigPath');

const configPath = getConfigPath(
  process.argv[2],
  'picompiler.config.js'
);

const config = require(configPath);

const buildConfigPath = getConfigPath(
  process.argv[3],
  config.configName
);

const buildConfig = require(buildConfigPath);

build(config, buildConfig);
