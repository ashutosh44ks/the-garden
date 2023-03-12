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

// let files = [];
// app.post("/api/upload", (req, res) => {
//   console.log(req.body.formData);
//   files.push(req.body.file);
//   res.json({ msg: "File uploaded" });
// });
// app.get("/api/view", (req, res) => {
//   res.json({ file: files });
// });

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log("Server listening the port http://localhost/" + port);
});
