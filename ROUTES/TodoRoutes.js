const express = require("express");
const bodyParser = require("body-parser");
const authenticateToken = require('../Controllers/authController')
const Todo = require('../MODELS/Todo')
const router = express.Router();
router.use(bodyParser.json());


router.get('/test', (req, res) => {
    res.json({
        message: "The Todo api is woking"
    })
});

// To create TODO
router.post('/createtodo', authenticateToken, async (req, res) => {
    try {
        const { title, description } = req.body;
        const userId = req.id;
        console.log("This is user id", userId);
        const newTodo = new Todo({
            title,
            description,
            user: userId.id
        })
        await newTodo.save();
        res.status(201).json({
            message: "Todo created successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Some error occcured"
        })
    }

})
router.get('/getalltodos', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id; // Get user ID from authenticated request
        console.log(userId);
        const todos = await Todo.find({ user: userId });
        res.status(200).json({
            todos,
            message: "Todos retrieved successfully"
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

// GET a specific todo by ID
router.get('/getalltodos/:id', authenticateToken, async (req, res) => {
    try {
        const userId = req.id;
        const todo = await Todo.findOne({ _id: req.params.id, user: userId.id });
        if (!todo) {
            return res.status(404).json({
                message: "Todo not found"
            });
        }
        res.status(200).json({
            todo,
            message: "Todo retrieved successfully"
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

// Update a todo
router.put('/updatetodo/:id', authenticateToken, async (req, res) => {
    try {
        const userId = req.id; // Get user ID from authenticated request
        const { title, description, completed } = req.body;
        const updatedTodo = await Todo.findOneAndUpdate({ _id: req.params.id, user: userId.id }, { title, description, completed }, { new: true });
        if (!updatedTodo) {
            return res.status(404).json({
                message: "Todo not found or unauthorized"
            });
        }
        res.status(200).json({
            todo: updatedTodo,
            message: "Todo updated successfully"
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

// Delete a todo
router.delete('/deletetodo/:id', authenticateToken, async (req, res) => {
    try {
        const userId = req.id; // Get user ID from authenticated request
        const deletedTodo = await Todo.findOneAndDelete({ _id: req.params.id, user: userId.id });
        if (!deletedTodo) {
            return res.status(404).json({
                message: "Todo not found or unauthorized"
            });
        }
        res.status(200).json({
            message: "Todo deleted successfully"
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

module.exports = router;