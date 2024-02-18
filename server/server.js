const express = require('express');
const dbConnect = require('./config/dbConnect');
const initRoutes = require('./routers');
require('dotenv').config();
var cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        methods: ['POST', 'PUT', 'GET', 'DELETE'],
    })
);
app.use(cookieParser());
const port = process.env.PORT || 8888;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dbConnect();
initRoutes(app);
app.listen(port, () => {
    console.log('Server running on the port: ' + port);
});
