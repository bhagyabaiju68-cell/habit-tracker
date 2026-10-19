type Habit = {
    habitId: number;
    name: string;
    checkins: string[];
};

let habits: Habit[] = [];
let nextHabitId = 1;

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

export function clear() {
    habits = [];
    nextHabitId = 1;
    return {};
}