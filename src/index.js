const compile = require('./compile');
const almondtree = require('almondtree');
const R = require('ramda');
const fs = require('fs');

const getConfigPath = require('./getConfigPath');
const build = require('./build');

const picompiler = (text, lang, config) => {
  const files = fs.readdirSync(
    config.corePath + '/' + lang
  );

  const core = R.pipe(
    R.map((file) =>
      fs.readFileSync(
        config.corePath + '/' + lang + '/' + file,
        'utf8'
      )
    ),
    R.join('\n')
  )(files);

  return config.languages[lang].holder(
    text,
    core,
    almondtree,
    compile,
    config.tokens,
    config.languages[lang].dynamicCore
  );
};

module.exports = { getConfigPath, build, picompiler };
