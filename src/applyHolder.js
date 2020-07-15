const compile = require('./compile');
const almondtree = require('almondtree');
const R = require('ramda');
const fs = require('fs');

module.exports = (text, config) => {
  const files = fs.readdirSync(config.corePath);

  const core = R.pipe(
    R.map((file) =>
      fs.readFileSync(config.corePath + '/' + file, 'utf8')
    ),
    R.join('\n')
  )(files);

  return config.holder(
    text,
    core,
    almondtree,
    compile,
    config
  );
};
