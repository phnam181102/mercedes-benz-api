const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();

dotenv.config();
const PORT = process.env.PORT || 3000;

const route = require('./routes');
const db = require('./config/db');

// Connect to DB
db.connect();

app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(express.json());

// HTTP logger
app.use(morgan('combined'));

// Routes init
route(app);

app.listen(PORT, () => {
    console.log(`Server running on port: http://localhost:${PORT}`);
});
