const compile = require('./compile');
const almondtree = require('almondtree');

module.exports = (text, config) => {
  return config.holder(text, almondtree, compile, config);
};
