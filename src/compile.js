const almondtree = require('almondtree');
const R = require('ramda');

module.exports = (expression, dynamicCore) => {
  const compile = (expression) => {
    if ('Array' === R.type(expression)) {
      const fnName = R.head(expression);
      const elems = R.tail(expression);

      const dynamicFunction = dynamicCore(compile)[fnName];

      if (dynamicFunction) {
        return dynamicFunction(elems);
      } else {
        const params = R.pipe(
          R.map(compile),
          R.join(', ')
        )(elems);

        return `${fnName}(${params})`;
      }
    } else {
      return expression;
    }
  };

  return compile(expression);
};
