const jwt = require('jsonwebtoken');
const Register = require('../MODELS/User');
require('dotenv').config();

const authenticateToken = async (req, res, next) => {
    try {
        // const token = req.cookies.token;
        const token = req.headers.authorization;
        // const token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZTQ1YTBmYTc3ZTMyOWIzNDRjZTdmMSIsImlhdCI6MTcwOTY1NjE4MCwiZXhwIjoxNzA5NjU3MzgwfQ.o7UevCpHJorrw3rWGnjzev9kDz9HpJSJXSLHyTm18pg"
        
        console.log(token)
        if (!token) {
            return res.status(401).json({ message: "Auth Error: Token not provided" });
        }

        const user = await Register.findOne({ token });
        if (!user) {
            return res.status(401).json({ message: "Auth Error: Invalid Token" });
        }

        // Verify the token

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded; // Attach the decoded user information to the request object
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
}

module.exports = authenticateToken;