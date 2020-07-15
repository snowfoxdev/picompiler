const compile = require('./compile');

module.exports = (expression, { dynamicCore }) => {
  return compile(expression, { dynamicCore });
};
