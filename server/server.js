var express = require("express");
var app = express();
const cors = require("cors");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


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
