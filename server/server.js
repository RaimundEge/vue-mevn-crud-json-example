// Importing required modules
const cors = require('cors');
const express = require('express');

// parse env variables
require('dotenv').config();

require("./helpers/db/mongodb.js")();
const secret = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');
// Configuring port
const port = process.env.PORT || 9000;

const app = express();

// Configure middlewares
app.use(cors());
app.use(express.json());

// authenticate
app.use((req, res, next) => {
    console.log('authenticate', req.method, req.url);
    switch (req.url) {
        case '/api/register':
        case '/api/login':
            return next();
    }
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, secret, (err, user) => {
            if (err) {
                return res.status(403).json({ error: 'Invalid credentials' });
            } else {
                console.log("token contains: ", user); 
                next();
            }          
        })
    } else {
        return res.status(403).json({ error: 'Credentials missing' });       
    }
});

app.set('view engine', 'html');

// Static folder
app.use(express.static(__dirname + '/views/'));

// Defining route middleware
app.use('/api', require('./routes/api'));

// Listening to port
app.listen(port);
console.log(`Listening On http://localhost:${port}/api`);

module.exports = app;
