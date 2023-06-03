import { chooseOptionFromArr, produceRandomNumbers } from '../assets/scripts/fortunes.js';

/**
 * Tests:
 * 	- Return a nonempty string.
 */
describe('produceFortuneFromArr', () => {
	test('should return a nonempty string', () => {
		const result = chooseOptionFromArr(['item1', 'item2', 'item3']);
		expect(result).toBeTruthy(); // non-empty
		expect(typeof result).toBe('string');
		expect(['item1', 'item2', 'item3']).toContain(result);
	});
});

/**
 * Tests:
 *  - Return an array of numbers
 *  - Return an array where all numbers are distinct
 *  - Return numbers >= low and < high
 */
describe('produceRandomNumbers', () => {
	test('should return an array of numbers', () => {
		const result = produceRandomNumbers(3, 0, 100);
		expect(result.length).toBe(3);
		expect(typeof result).toBe('object');
		result.forEach((n) => {
			expect(typeof n).toBe('number');
		});
	});

	test('should return distinct numbers', () => {
		const result = produceRandomNumbers(5, 0, 5);
		const expectedNumbers = [0, 1, 2, 3, 4];
		expect(result.length).toBe(expectedNumbers.length);
		expectedNumbers.forEach((n) => {
			expect(result).toContain(n);
		});
	});

	test('should return numbers in range [low,high)', () => {
		const result = produceRandomNumbers(5, 0, 5);
		result.forEach((n) => {
			expect(n).toBeLessThan(5);
			expect(n).toBeGreaterThanOrEqual(0);
		});
	});
});
