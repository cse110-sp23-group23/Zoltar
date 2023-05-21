import { jest } from '@jest/globals';
import { produceFortune } from '../assets/scripts/fortunes';

describe("produceFortune", () => {
  test('should return a nonempty string', () => {
    const result = produceFortune();
    expect(result).toBeTruthy(); // non-empty
    expect(typeof result).toBe('string');
  });
});
