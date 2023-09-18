import { add, divide, multiply, subtract  } from './functions';
const { test, expect } = require('@playwright/test');

for (let i = 0; i < 100; i++) {
    test(`adds ${i}`, () => {
        expect(add(1, 2)).toBe(3);
    });
    test(`substruct ${i}`, () => {
        expect(subtract(1, 2)).toBe(-1);
    });
    test(`multiply ${i}`, () => {
        expect(multiply(1, 2)).toBe(2);
    });
    test(`divide ${i}`, () => {
        expect(divide(2, 2)).toBe(1);
    });
}
