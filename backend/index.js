// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); 

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const Task = require('./schemas/Task');

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Task Management API' });
});

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB Atlas');
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch(err => {
        console.error('Could not connect to MongoDB:', err);
    });

app.get('/tasks', async (req, res) => {
    console.log('Fetching tasks...');
    try {
        const tasks = await Task.find().sort({ createdAt: -1 }); // Sort by newest first
        res.json(tasks);
    } catch (err) {
        console.error('Error fetching tasks:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// New POST endpoint to create a task
app.post('/tasks', async (req, res) => {
    const { title, dueDate, priority, status } = req.body;

    // Validate that all required fields are present
    if (!title || !dueDate || !priority || !status) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Create a new task
    const task = new Task({
        title,
        dueDate,
        priority,
        status
    });

    try {
        const savedTask = await task.save();
        res.status(201).json(savedTask);
    } catch (err) {
        console.error('Error saving task:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});