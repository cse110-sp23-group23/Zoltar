import { clamp, chooseOptionFromArr, toggleClassToArr } from '../assets/scripts/util.js';
import { convertArrToReadableString } from '../assets/scripts/ticket.js';

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

/**
 * Tests:
 *  - Return a nonempty string.
 */
describe('chooseOptionFromArr', () => {
	test('should return a nonempty string', () => {
		const result = chooseOptionFromArr(['item1', 'item2', 'item3']);
		expect(result).toBeTruthy(); // non-empty
		expect(typeof result).toBe('string');
		expect(['item1', 'item2', 'item3']).toContain(result);
	});
});

/**
 * Tests:
 * - Add class to tags
 * - Remove class to tags
 */
describe('toggleClassToArr', () => {
	const one = document.createElement('section');
	const two = document.createElement('div');
	const three = document.createElement('h1');

	const arr = [one, two, three];

	function testClassList(classlist, bool, int) {
		expect((typeof classlist)).toBe('object');
		expect((classlist.contains('dummy-class'))).toBe(bool);
		expect((classlist.length)).toBe(int);
	}

	beforeEach(() => {
		toggleClassToArr(arr, 'dummy-class');
	});

	test('should add class to the tags', () => {
		arr.forEach((tag) => {
			testClassList(tag.classList, true, 1);
		});
	});

	test('should remove class from the tags', () => {
		arr.forEach((tag) => {
			testClassList(tag.classList, false, 0);
		});
	});
});

/**
 * Tests:
 * - Return an empty string
 * - Return a single number in string form
 * - Return two numbers in string form and correct grammar
 * - Return three numbers in string form and correct grammar
 * - Return four numbers in string form and correct grammar
 */
describe('convertArrToReadableString', () => {
	const zero = [];
	const one = [1];
	const two = [1, 2];
	const three = [1, 2, 3];
	const four = [1, 2, 3, 4, 5];

	test('should return empty string', () => {
		expect(convertArrToReadableString(zero)).toBe('');
	});

	test('should return single number as string', () => {
		expect(convertArrToReadableString(one)).toBe('1');
	});

	test('should return "n, and n" ', () => {
		expect(convertArrToReadableString(two)).toBe('1, and 2');
	});

	test('should return "n, n, n, and n" ', () => {
		expect(convertArrToReadableString(three)).toBe('1, 2, and 3');
	});

	test('should return "n, n, n, n, and n" ', () => {
		expect(convertArrToReadableString(four)).toBe('1, 2, 3, 4, and 5');
	});
});
