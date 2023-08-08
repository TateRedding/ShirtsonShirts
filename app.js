const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");

// middleware/ api setup
require("dotenv").config();
app.use(morgan("dev"));
app.use(bodyParser.json());

const apiRouter = require("./api/index.js");
app.use("/api", apiRouter);

app.use(cors());

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
