const R = require('ramda');

module.exports = (arg, defaultName) => {
  if (arg) {
    return (
      process.cwd() + '/' + R.replace(/^\.?\/?/, '', arg)
    );
  } else {
    return process.cwd() + '/' + defaultName;
  }
};
