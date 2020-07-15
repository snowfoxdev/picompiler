const picompiler = require('../index');
const config = require('../../example/picompiler.config.js');

test('number', () => {
  const text = `100`;

  const output = `const core_add = (a, b) => a + b;

const core_subtract = (a, b) => a - b;


const main = (()=>{ return 100;})();

if (!['undefined', 'function'].includes(typeof main)) {
  console.log(main);
}`;

  expect(picompiler(text, 'js', config)).toEqual(output);
});

test('add and subtract', () => {
  const text = `(+ (- 1 2) 4)`;

  const output = `const core_add = (a, b) => a + b;

const core_subtract = (a, b) => a - b;


const main = (()=>{ return core_add(core_subtract(1, 2), 4);})();

if (!['undefined', 'function'].includes(typeof main)) {
  console.log(main);
}`;

  expect(picompiler(text, 'js', config)).toEqual(output);
});

test('let', () => {
  const text = `a 1 b 2 a`;

  const output = `const core_add = (a, b) => a + b;

const core_subtract = (a, b) => a - b;


const main = (()=>{a = 1; b = 2; return a;})();

if (!['undefined', 'function'].includes(typeof main)) {
  console.log(main);
}`;

  expect(picompiler(text, 'js', config)).toEqual(output);
});
