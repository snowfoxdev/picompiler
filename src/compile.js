const almondtree = require('almondtree');
const R = require('ramda');

module.exports = (
  expression,
  { dynamicFunctions, dynamicTokens }
) => {
  const compile = (expression) => {
    if ('Array' === R.type(expression)) {
      const fnName = R.head(expression);
      const elems = R.tail(expression);

      const dynamicFunction = dynamicFunctions(compile)[
        fnName
      ];

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
      return R.cond([...dynamicTokens, [R.T, R.identity]])(
        expression
      );
    }
  };

  return compile(expression);
};
