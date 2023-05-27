import { clamp } from '../assets/scripts/storage.js';

/**
 * Test:
 *  - Return clamp value as low
 *  - Return clamp value as high
 *  - Return clamp value as value
 */
describe('clamp', () => {
	test('should clamp value to low', () => {
		const result = clamp(0, 10, 20);
		expect(result).toBe(10);
	});

	test('should clamp value to high', () => {
		const result = clamp(100, 10, 20);
		expect(result).toBe(20);
	});

	test('should clamp value to value', () => {
		const result = clamp(15, 10, 20);
		expect(result).toBe(15);
	});
});
