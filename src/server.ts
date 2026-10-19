import express from 'express';
import { addHabit, listHabits } from './habits.ts';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/habits', (req, res) => {
    res.json(listHabits());
});
app.post('/habits', (req, res) => {
    if (req.body === undefined || typeof req.body.name !== 'string') {
        res.status(400).json({ error: 'Name must be text' });
        return;
    }
    const result = addHabit(req.body.name);
    if ('error' in result) { 
        res.status(400).json(result);
        return;
    }
    res.json(result);
});

app.listen(PORT, () => {
    console.log('Server running at http://localhost:' + PORT);
});