const express = require("express");
const morgan = require("morgan");
const app = express();
const port = 3000;

app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(express.json());

// HTTP logger
// app.use(morgan("combined"));

app.get("/", (req, res) => {
    res.render("home");
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
