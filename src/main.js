const getConfigPath = require('./getConfigPath');
const build = require('./build');

module.exports = (config) => {
  const buildConfigPath = getConfigPath(
    process.argv[2],
    config.configName
  );

  const buildConfig = require(buildConfigPath);

  build(config, buildConfig);
};
