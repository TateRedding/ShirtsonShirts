const express = require("express");
const app = express();
const path = require("path");

require("dotenv").config();
app.use(require("morgan")("dev"));
app.use(require("body-parser").json());
app.use("/api", require("./api/index.js"));
app.use(require("cors")());

app.use("/dist", express.static(path.join(__dirname, "dist")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/style.css", express.static(path.join(__dirname, "style.css")));
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "style.css")));

app.use("*", (req, res, next) => {
    res.status(404);
    res.send({ error: "route not found" });
});

app.use((error, req, res, next) => {
    res.send({
        name: error.name,
        message: error.message,
    });
    res.status(500);
});

module.exports = app;
