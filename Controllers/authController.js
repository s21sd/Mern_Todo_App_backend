const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
    const token = req.cookies.token; // Extract token from cookies
    // console.log('token', token);

    if (!token) {
        return res.status(401).json({ message: "Auth Error" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.id = decoded;
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Invalid Token" });
    }
}

module.exports = authenticateToken;
