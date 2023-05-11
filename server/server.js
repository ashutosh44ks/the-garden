require("dotenv").config({
  path: process.env.NODE_ENV === "production" ? ".env" : ".env.development",
});

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.set("strictQuery", true);
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  family: 4,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

const authRouter = require("./routes/auth");
app.use("/api/auth", authRouter);
const usersRouter = require("./routes/users");
app.use("/api/users", usersRouter);
const subjectsRouter = require("./routes/subjects");
app.use("/api/subjects", subjectsRouter);
const subjectsFileHandlingRouter = require("./routes/subjectsFileHandling");
app.use("/api/subjects", subjectsFileHandlingRouter);
const calendarsRouter = require("./routes/calendars");
app.use("/api/calendars", calendarsRouter);
const miscRouter = require("./routes/misc");
app.use("/api/misc", miscRouter);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log("Server listening the port " + port);
});
