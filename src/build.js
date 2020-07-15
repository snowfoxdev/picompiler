const R = require('ramda');

const fs = require('fs');
const watch = require('node-watch');
const glob = require('glob');

const { picompiler } = require('./index');

module.exports = (config, buildConfig) => {
  const writeFiles = (text, filePath) => {
    R.mapObjIndexed(
      ({ dynamicFunctions, holder }, lang) => {
        const newText = picompiler(text, lang, config);

        const newFilePath = R.replace(
          RegExp(
            `^${buildConfig.srcPath}(.+)\.${config.fileExtension}`
          ),
          `${buildConfig.buildPath}/${lang}$1.${lang}`,
          filePath
        );

        const newFolder = R.replace(
          /(.+)\/.+$/,
          '$1/',
          newFilePath
        );

        if (!fs.existsSync(newFolder)) {
          fs.mkdirSync(newFolder, { recursive: true });
        }

        fs.writeFileSync(newFilePath, newText);
      },
      config.languages
    );
  };

  const build = (e, filePath) => {
    try {
      if (R.includes(config.fileExtension, filePath)) {
        console.log(filePath);

        const text = fs.readFileSync(filePath, 'utf8');

        if (text) {
          writeFiles(text, filePath);

          console.log('Built');
          console.log('');
          console.log('.........................');
          console.log('');
        }
      }
    } catch (error) {
      return console.log(error);
    }
  };

  // fs.rmdirSync(langConfig.buildPath, { recursive: true });

  glob(
    buildConfig.srcPath + '/**/*.' + config.fileExtension,
    (er, files) => {
      R.forEach((file) => build('', file), files);
    }
  );

  watch(buildConfig.srcPath, { recursive: true }, build);
};
