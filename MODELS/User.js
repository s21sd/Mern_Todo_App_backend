const mongoose = require('mongoose');
const registerScema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    todo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Todos',
    },
})

const Register = mongoose.model('Register', registerScema);

module.exports = Register;