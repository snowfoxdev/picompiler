const almondtree = require('almondtree');
const compile = require('../compile');
const config = require('../../example/picompiler.config.js');

test('add and subtract', () => {
  const text = `(+ (- 1 2) 4)`;

  const ast = almondtree(text, config);

  const output = 'core_add(core_subtract(1, 2), 4)';

  expect(compile(ast, config.languages.js)).toEqual(output);
});

test('let', () => {
  const text = `(let a 1 b 2 a)`;

  const ast = almondtree(text, config);

  const output = '(()=>{a = 1; b = 2; return a;})()';

  expect(compile(ast, config.languages.js)).toEqual(output);
});

test('if', () => {
  const text = `(if true (+ 2 2) (- 2 2))`;

  const ast = almondtree(text, config);

  const output =
    '(true ? core_add(2, 2) : core_subtract(2, 2))';

  expect(compile(ast, config.languages.js)).toEqual(output);
});

test('$', () => {
  const text = `($ (log 100) (log 200))`;

  const ast = almondtree(text, config);

  const output = '(()=>{core_log(100);core_log(200)})()';

  expect(compile(ast, config.languages.js)).toEqual(output);
});

test('#', () => {
  const text = `(# a b c (+ a b c))`;

  const ast = almondtree(text, config);

  const output = '(a, b, c) => core_add(a, b, c)';

  expect(compile(ast, config.languages.js)).toEqual(output);
});

test('[]', () => {
  const text = `(log [1 2 3])`;

  const ast = almondtree(text, config);

  const output = 'core_log([1, 2, 3])';

  expect(compile(ast, config.languages.js)).toEqual(output);
});

test('{}', () => {
  const text = `(log {a 1 b 2})`;

  const ast = almondtree(text, config);

  const output = 'core_log({a: 1, b: 2})';

  expect(compile(ast, config.languages.js)).toEqual(output);
});
