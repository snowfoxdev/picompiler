const R = require('ramda');

const tokens = [
  {
    value: '(',
  },
  {
    value: ')',
  },
  {
    // numbers
    value: /^[\d\._]+$/,
  },
  {
    // identifiers
    value: /^[0-9a-zA-Z_\.]+$/,
  },
  {
    // single quote strings
    value: /^'[^']*'?$/,
  },
  {
    // double quote strings
    value: /^"[^"]*"?$/,
  },
  {
    // comments
    value: /^\n? *;.*\n?$/,
  },
  {
    value: '[',
    replace: ['(', 'core_list'],
  },
  {
    value: ']',
    replace: ')',
  },
  {
    value: '{',
    replace: ['(', 'core_hashmap'],
  },
  {
    value: '}',
    replace: ')',
  },

  { value: '|', replace: 'core_or' },
  { value: '~', replace: 'core_pipe' },
  { value: '-', replace: 'core_subtract' },
  { value: '*', replace: 'core_multiply' },
  { value: '+', replace: 'core_add' },
  { value: '/', replace: 'core_divide' },
  { value: '>', replace: 'core_gt' },
  { value: '<', replace: 'core_lt' },
  { value: '>=', replace: 'core_gte' },
  { value: '<=', replace: 'core_lte' },
  { value: '++', replace: 'core_concat' },
  { value: '=', replace: 'core_equals' },
  { value: '%', replace: 'core_remainder' },
  { value: '&', replace: 'core_and' },
  { value: '#', replace: 'core_function' },
  { value: '$', replace: 'core_commands' },

  { value: 'splitEvery', isCore: true },
  { value: 'join', isCore: true },
  { value: 'all', isCore: true },
  { value: 'any', isCore: true },
  { value: 'set', isCore: true },
  { value: 'map', isCore: true },
  { value: 'imap', isCore: true },
  { value: 'type', isCore: true },
  { value: 'range', isCore: true },
  { value: 'log', isCore: true },
  { value: 'let', isCore: true },
  { value: 'if', isCore: true },

  { value: 'import', replace: 'require' },
];

const dynamicFunctions = (compile) => ({
  core_let: (elems) => {
    const assignments = elems.length
      ? R.pipe(
          R.init,
          R.splitEvery(2),
          R.map(
            ([key, value]) => `${key} = ${compile(value)};`
          ),
          R.join(' ')
        )(elems)
      : '';

    const expression = R.last(elems);

    const theReturn =
      elems.length % 2 === 0 ? "''" : compile(expression);

    return `(()=>{${assignments} return ${theReturn};})()`;
  },
  core_commands: (elems) => {
    const components = R.pipe(
      R.map(compile),
      R.join(';')
    )(elems);

    return `(()=>{${components}})()`;
  },
  core_function: (elems) => {
    const params = R.init(elems);
    const expression = R.last(elems);

    return `(${R.join(', ', params)}) => ${compile(
      expression
    )}`;
  },
  core_list: (elems) => {
    const components = R.pipe(
      R.map(compile),
      R.join(', ')
    )(elems);

    return `[${components}]`;
  },
  core_hashmap: (elems) => {
    const components = R.pipe(
      R.splitEvery(2),
      R.map(([key, value]) => `${key}: ${compile(value)}`),
      R.join(', ')
    )(elems);

    return `{${components}}`;
  },
  core_if: (elems) => {
    const first = compile(elems[0]);
    const second = compile(elems[1]);
    const third = compile(elems[2]);

    return `(${first} ? ${second} : ${third})`;
  },
});

const dynamicTokens = [];

const holder = (
  text,
  core,
  almondtree,
  compile,
  config,
  lang
) => {
  const ast = almondtree(`(let ${text})`, {
    tokens: config.tokens,
  });

  const main = compile(ast, config.languages[lang]);

  return `${core}

const main = ${main};

if (!['undefined', 'function'].includes(typeof main)) {
  console.log(main);
}`;
};

module.exports = {
  tokens,
  fileExtension: 'e1',
  languages: {
    js: {
      dynamicTokens,
      dynamicFunctions,
      holder,
    },
  },
  configName: 'e1-lang.config.js',
  corePath: __dirname + '/core',
};
