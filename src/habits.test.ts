import { describe, test, expect, beforeEach } from 'vitest';
import { addHabit, listHabits, clear } from './habits.ts';

beforeEach(() => {
    clear();
});

describe('addHabit', () => {
    test('returns an id', () => {
        expect(addHabit('Read')).toStrictEqual({ habitId: expect.any(Number) });
    });
    test('empty name is an error', () => {
        expect(addHabit('')).toStrictEqual({ error: expect.any(String) });
    });
    test('name longer than 30 characters is an error', () => {
        expect(addHabit('a'.repeat(31))).toStrictEqual({ error: expect.any(String) });
    });
    test('duplicate name is an error', () => {
        addHabit('Read');
        expect(addHabit('read')).toStrictEqual({ error: expect.any(String) });
    });
});

describe('listHabits', () => {
    test('empty at the start', () => {
        expect(listHabits()).toStrictEqual({ habits: [] });
    });
    test('list habits in the order they were added', () => {
        addHabit('Eat fruits');
        addHabit('Read');
        expect(listHabits()).toStrictEqual({
            habits: [
                { habitId: expect.any(Number), name: 'Eat fruits' },
                { habitId: expect.any(Number), name: 'Read' },
            ],
        });
    });
});