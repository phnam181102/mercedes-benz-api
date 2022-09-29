const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();
const port = 3000;

const route = require('./routes');

dotenv.config();

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB!'))
    .catch((err) => console.log(err.message));

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

app.listen(port, () => {
    console.log(`Server running on port: http://localhost:${port}`);
});
