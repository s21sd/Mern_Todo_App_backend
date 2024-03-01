const express = require("express");
const bodyParser = require("body-parser");
const Register = require('../MODELS/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const authenticateToken = require("../Controllers/authController");
const router = express.Router();
router.use(bodyParser.json());


router.get('/test', (req, res) => {
    res.json({
        message: "The Todo api is woking"
    })
});

router.post('/register', async (req, res) => {
    try {
        const { name, password, email } = req.body;
        const emailExist = await Register.findOne({ email }); // check for user existence
        if (emailExist) {
            return res.status(409).json({ message: 'Email already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const myhashedPass = await bcrypt.hash(password, salt);
        const newUser = new Register({
            name,
            password: myhashedPass,
            email,
        })

        await newUser.save();
        res.status(201).json({
            message: "New User Created Successfully"
        })

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})


router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await Register.findOne({ email }); // check for user existence
        if (!existingUser) {
            return res.status(401).json({ message: "Invalid Credential" })
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ id: existingUser.id }, process.env.JWT_SECRET_KEY);
        res.cookie('token', token, { httpOnly: true })
        res.status(200).json({
            token,
            message: "User logged in successfully"
        });
    } catch (error) {
        console.log(error);
    }
})

router.get('/checkLogin', authenticateToken, async (req, res) => {
    res.status(200).json({ message: "User is logged in" }, res.ok);
})

module.exports = router;