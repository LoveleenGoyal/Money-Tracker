const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

const DB_FILE = 'data.json';

// Create a new record
app.post('/expenses', (req, res) => {
    const expense = req.body;
    const dbData = readDatabase();
    dbData.push(expense);
    writeDatabase(dbData);
    res.json(expense);
});

// Read all records
app.get('/expenses', (req, res) => {
    const dbData = readDatabase();
    res.json(dbData);

})
// Read a single record by ID
app.get('/expenses/:id', (req, res) => {
    const expenseId = req.params.id;
    const dbData = readDatabase();
    const expense = dbData.find(expense => expense.id === expenseId);
    if (expense) {
        res.json(expense);
    } else {
        res.status(404).json({ message: 'Expense not found' });
    }
});

// Update a record by ID
app.put('/expenses/:id', (req, res) => {
    const expenseId = req.params.id;
    const updatedData = req.body;
    const dbData = readDatabase();
    const expenseIndex = dbData.findIndex(expense => expense.id === expenseId);
    if (expenseIndex !== -1) {
        dbData[expenseIndex] = { ...dbData[expenseIndex], ...updatedData };
        writeDatabase(dbData);
        res.json(dbData[expenseIndex]);
    } else {
        res.status(404).json({ message: 'Expense not found' });
    }
});

// Delete a record by ID
app.delete('/expenses/:id', (req, res) => {
    const expenseId = req.params.id;
    let dbData = readDatabase();
    const expenseIndex = dbData.findIndex(expense => expense.id === expenseId);
    if (expenseIndex !== -1) {
        const deletedExpense = dbData.splice(expenseIndex, 1)[0];
        writeDatabase(dbData);
        res.json(deletedExpense);
    } else {
        res.status(404).json({ message: 'Expense not found' });
    }
});

function readDatabase() {
    try {
        const dbData = fs.readFileSync(DB_FILE, { encoding: 'utf8' });
        return JSON.parse(dbData);
    } catch (error) {
        return [];
    }
}

function writeDatabase(dbData) {
    fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 2));
}

// Start the server
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
