require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
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

const usersRouter = require("./routes/users");
app.use("/api/users", usersRouter);
const subjectsRouter = require("./routes/subjects");
app.use("/api/subjects", subjectsRouter);
const subjectsFileHandlingRouter = require("./routes/subjectsFileHandling");
app.use("/api/subjects", subjectsFileHandlingRouter);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log("Server listening the port http://localhost/" + port);
});
