const R = require('ramda');

const fs = require('fs');
const watch = require('node-watch');
const glob = require('glob');

const applyHolder = require('./applyHolder');

module.exports = (config) => {
  const writeFiles = (text, filePath) => {
    R.mapObjIndexed(
      ({ dynamicFunctions, holder }, lang) => {
        const newText = applyHolder(text, lang, config);

        const newFilePath = R.replace(
          RegExp(
            `^${config.srcPath}(.+)\.${config.fileExtension}`
          ),
          `${config.buildPath}/${lang}$1.${lang}`,
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

  // fs.rmdirSync(config.buildPath, { recursive: true });

  glob(
    config.srcPath + '/**/*.' + config.fileExtension,
    (er, files) => {
      R.forEach((file) => build('', file), files);
    }
  );

  watch(config.srcPath, { recursive: true }, build);
};
