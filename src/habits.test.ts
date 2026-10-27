import { describe, test, expect, beforeEach } from 'vitest';
import { addHabit, listHabits, checkIn, listCheckins, getStreaks, clear } from './habits.ts';

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

describe('checkIn', () => {
    test('valid check-in return', () => {
        const habit = addHabit('Read') as { habitId: number };
        expect(checkIn(habit.habitId, '2026-10-20', '2026-10-26')).toStrictEqual({});
    });
    test('unknown habitId is an error', () => {
        expect(checkIn(999, '2026-10-20', '2026-10-26')).toStrictEqual({ error: expect.any(String) });
    });
    test.each([
        ['2026-13-01'],
        ['2026-02-30'],
        ['26-10-20'],
        ['hello'],
    ])('invalid date %s is an error', (date) => {
        const habit = addHabit('Read') as { habitId: number };
        expect(checkIn(habit.habitId, date, '2026-10-26')).toStrictEqual({ error: expect.any(String) });
    });
    test('future date is an error', () => {
        const habit = addHabit('Read') as { habitId: number };
        expect(checkIn(habit.habitId, '2026-10-27', '2026-10-26')).toStrictEqual({ error: expect.any(String) });
    });
    test('today is allowed', () => {
        const habit = addHabit('Read') as { habitId: number };
        expect(checkIn(habit.habitId, '2026-10-26', '2026-10-26')).toStrictEqual({});
    });
    test('same date twice is an error', () => {
        const habit = addHabit('Read') as { habitId: number };
        checkIn(habit.habitId, '2026-10-20', '2026-10-26');
        expect(checkIn(habit.habitId, '2026-10-20', '2026-10-26')).toStrictEqual({ error: expect.any(String) });
    });
});

describe('listCheckins', () => {
    test('unknown habitId is an error', () => {
        expect(listCheckins(999)).toStrictEqual({ error: expect.any(String) });
    });
    test('returns dates sorted oldest first', () => {
        const habit = addHabit('Read') as { habitId: number };
        checkIn(habit.habitId, '2026-10-22', '2026-10-26');
        checkIn(habit.habitId, '2026-10-20', '2026-10-26');
        checkIn(habit.habitId, '2026-10-21', '2026-10-26');
        expect(listCheckins(habit.habitId)).toStrictEqual({
            checkins: ['2026-10-20', '2026-10-21', '2026-10-22'],
        });
    });
});

describe('getStreaks', () => {
    const today = '2026-10-20';
    test('no check-ins', () => {
        addHabit('Read');
        expect(getStreaks(1, today)).toStrictEqual({ current: 0, longest: 0 });
    });
    test('only today', () => {
        addHabit('Read');
        checkIn(1, '2026-10-20', today);
        expect(getStreaks(1, today)).toStrictEqual({ current: 1, longest: 1 });
    });
    test('3 days in a row', () => {
        addHabit('Read');
        checkIn(1, '2026-10-18', today);
        checkIn(1, '2026-10-19', today);
        checkIn(1, '2026-10-20', today);
        expect(getStreaks(1, today)).toStrictEqual({ current: 3, longest: 3 });
    });
    test('today not done yet keeps streak', () => {
        addHabit('Read');
        checkIn(1, '2026-10-18', today);
        checkIn(1, '2026-10-19', today);
        expect(getStreaks(1, today)).toStrictEqual({ current: 2, longest: 2 });
    });
    test('gap breaks current streak', () => {
        addHabit('Read');
        checkIn(1, '2026-10-17', today);
        checkIn(1, '2026-10-18', today);
        expect(getStreaks(1, today)).toStrictEqual({ current: 0, longest: 2 });
    });
    test('longest is an older run', () => {
        addHabit('Read');
        checkIn(1, '2026-10-14', today);
        checkIn(1, '2026-10-15', today);
        checkIn(1, '2026-10-16', today);
        checkIn(1, '2026-10-17', today);
        checkIn(1, '2026-10-19', today);
        checkIn(1, '2026-10-20', today);
        expect(getStreaks(1, today)).toStrictEqual({ current: 2, longest: 4 });
    });
    test('works across months', () => {
        addHabit('Read');
        checkIn(1, '2026-09-30', '2026-10-01');
        checkIn(1, '2026-10-01', '2026-10-01');
        expect(getStreaks(1, '2026-10-01')).toStrictEqual({ current: 2, longest: 2 });
    });
    test('unknown habit is an error', () => {
        addHabit('Read');
        expect(getStreaks(2, today)).toStrictEqual({ error: expect.any(String) });
    });
});