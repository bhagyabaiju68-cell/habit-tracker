type Habit = {
    habitId: number;
    name: string;
    checkins: string[];
};

let habits: Habit[] = [];
let nextHabitId = 1;

function findHabit(habitId: number) {
    for (const habit of habits) {
        if (habit.habitId === habitId) {
            return habit;
        }
    }
    return undefined;
}

function isValidDate(date: string) {
    if (date.length !== 10) {
        return false;
    }
    if (date[4] !== '-' || date[7] !== '-') {
        return false;
    }
    const d = new Date(date + 'T00:00:00Z');
    if (isNaN(d.getTime())) {
        return false;
    }
    if (d.toISOString().slice(0, 10) !== date) {
        return false;
    }
    return true;
}

export function addHabit(name: string) {
    if (name === '') {
        return { error: 'Name cannot be empty' };
    }
    if (name.length > 30) {
        return { error: 'Name cannot be longer than 30 characters' };
    }
    for (const habit of habits) {
        if (habit.name.toLowerCase() === name.toLowerCase()) {
            return { error: 'Name already exists' };
        }
    }
    habits.push({ habitId: nextHabitId, name: name, checkins: [] });
    const newHabitId = nextHabitId;
    nextHabitId = nextHabitId + 1;
    return { habitId: newHabitId };
}

export function listHabits() {
    const result = [];
    for (const habit of habits) {
        result.push({ habitId: habit.habitId, name: habit.name });
    }
    return { habits: result };
}
export function checkIn(habitId: number, date: string, today: string) {
    const habit = findHabit(habitId);
    if (habit === undefined) {
        return { error: 'Habit not found' };
    }
    if (!isValidDate(date)) {
        return { error: 'Invalid date' };
    }
    if (date > today) {
        return { error: 'Date cannot be in the future' };
    }
    if (habit.checkins.includes(date)) {
        return { error: 'Already checked in on this date' };
    }
    habit.checkins.push(date);
    return {};
}

export function listCheckins(habitId: number) {
    const habit = findHabit(habitId);
    if (habit === undefined) {
        return { error: 'Habit not found' };
    }
    const sorted = habit.checkins.slice().sort();
    return { checkins: sorted };
}

export function clear() {
    habits = [];
    nextHabitId = 1;
    return {};
}