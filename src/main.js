const getConfigPath = require('./getConfigPath');
const build = require('./build');
const index = require('.index/');

exports.build = (config) => {
  const buildConfigPath = getConfigPath(
    process.argv[2],
    config.configName
  );

  const buildConfig = require(buildConfigPath);

  build(config, buildConfig);
};

exports.index = index;
