import compiler from './compiler.js';

test('Inserts mock code and outputs JavaScript', async () => {
  const stats = await compiler('example/index.js');
  const output = stats.toJson().modules[0].source;

  expect(output).toContain('require(\'./mock/mock.js\')();');
});
