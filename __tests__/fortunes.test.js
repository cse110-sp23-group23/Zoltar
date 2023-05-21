const fortunes = require('./assets/scripts/fortunes');

describe("produceFortune", () => {
  test('should return a nonempty string', () => {
    const result = fortunes.produceFortune();
    expect(result).toBeTruthy(); // non-empty
    expect(typeof result).toBe('string');
  });
});
