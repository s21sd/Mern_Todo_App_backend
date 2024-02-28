const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors');
const todoRoutes = require('./ROUTES/TodoRoutes')
const authRoutes = require('./ROUTES/AuthRoutes')
require('./db');
const PORT = 8000;
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/todoRoutes', todoRoutes);
app.use('/auth', authRoutes)

app.get('/', (req, res) => {
    res.json({
        message: "Api is working"
    });
})

app.listen(PORT, () => {
    console.log(`Server is running on the port ${PORT}`);
})