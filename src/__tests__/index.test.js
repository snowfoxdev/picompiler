const almondtree = require('almondtree');
const index = require('../index');
const config = require('../../demo/e1-config');

test('number', () => {
  const text = `100`;

  const output = `const main = (()=>{ return 100;})();

if (!['undefined', 'function'].includes(typeof main)) {
  console.log(main);
}`;

  expect(index(text, config)).toEqual(output);
});

test('add and subtract', () => {
  const text = `(+ (- 1 2) 4)`;

  const output = `const main = (()=>{ return core_add(core_subtract(1, 2), 4);})();

if (!['undefined', 'function'].includes(typeof main)) {
  console.log(main);
}`;

  expect(index(text, config)).toEqual(output);
});

test('let', () => {
  const text = `a 1 b 2 a`;

  const output = `const main = (()=>{a = 1; b = 2; return a;})();

if (!['undefined', 'function'].includes(typeof main)) {
  console.log(main);
}`;

  expect(index(text, config)).toEqual(output);
});
