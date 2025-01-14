const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const contactsRouter = require("./routes/api/contacts");
const usersRouter = require("./routes/api/user");
const path = require("path");
const sgMail = require("@sendgrid/mail");

const app = express();
dotenv.config();
require("./middlewares/passportConfig");

const URL_DB = process.env.URL_DB;
mongoose
 .connect(URL_DB)
 .then(() => {
  console.log("Database connection successful");
 })
 .catch((err) => {
  console.log(`Eroare:${err.message}`);
 });
const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.use("/api/contacts", contactsRouter);
app.use("/api/users", usersRouter);

app.use((req, res) => {
 res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
 res.status(500).json({ message: err.message });
});

module.exports = { app };
