import { jest } from '@jest/globals';
import { clamp } from '../assets/scripts/storage';

/**
 * Test:
 *  - Return clamp value as low
 *  - Return clamp value as high
 *  - Return clamp value as value
 */
describe(`clamp`, () => {
    test(`should clamp value to low`, () => {
        let result = clamp(0, 10, 20);
        expect(result).toBe(10);
    })

    test(`should clamp value to high`, () => {
        let result = clamp(100, 10, 20);
        expect(result).toBe(20);
    })

    test(`should clamp value to value`, () => {
        let result = clamp(15, 10, 20);
        expect(result).toBe(15);
    })
})
