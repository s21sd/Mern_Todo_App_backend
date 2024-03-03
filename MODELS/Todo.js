const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Register',
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    completed: {
        type: Boolean,
        default: false
    },
    
}, { timestamps: true });

const Todo = mongoose.model('Todos', todoSchema);
module.exports = (Todo);