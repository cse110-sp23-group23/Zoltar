import { jest } from '@jest/globals';
import { produceFortune, produceRandomNumbers } from '../assets/scripts/fortunes';

describe("produceFortune", () => {
  test('should return a nonempty string', () => {
    const result = produceFortune([{ "message": "Here's a message" }, { "message": "Here's another" }]);
    expect(result).toBeTruthy(); // non-empty
    expect(typeof result).toBe('string');
    expect(result).toBe(`Here's a message` || `Here's another`);
  });
});


/**
 * Tests:
 *  - Return an array of numbers
 *  - Return an array where all numbers are distinct
 *  - Return numbers >= low and < high
 */
describe("produceRandomNumbers", () => {
  test(`should return an array of numbers`, () => {
    const result = produceRandomNumbers(3, 0, 100);
    expect(result.length).toBe(3);
    expect(typeof result).toBe(`object`);
    for (let i = 0; i < result.length; i++) {
      expect(typeof result[i].toBe(`number`));
    }
  })

  test(`should return distinct numbers`, () => {
    let distinct = produceRandomNumbers(5, 0, 5);
    let dummy = [0, 1, 2, 3, 4];
    for (let i = 0; i < 5; i++) {
      let index = distinct.indexOf(i);
      dummy.splice(index, 1);
    }
    expect(dummy.length).toBe(0);
  })

  test(`should return numbers ∈ [low,high)`, () => {
    let result = produceRandomNumbers(5, 0, 5);
    for (let i = 0; i < 5; i++) {
      expect(result[i]).toBeLessThan(5);
      expect(result[i]).toBeGreaterThanOrEqual(0);
    }
  })
})
