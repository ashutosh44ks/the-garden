var express = require("express");
var app = express();
const cors = require("cors");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let users = [{ username: "admin", password: "1234", id: 0 }];
let subjects = [
  {
    name: "Computer Networks",
    code: "TIT69",
    description:
      "Computer networking refers to connected computing devices (such as laptops, desktops, servers, smartphones, and tablets) and an ever-expanding array of IoT devices (such as cameras, door locks, doorbells, refrigerators, audio/visual systems, thermostats, and various sensors) that communicate with one another. ",
    year: 3,
    credits: 4,
    gate: true,
    practical: false,
    difficulty: 3,
    professors: [
      {
        name: "Mr. Smith",
        code: "TITS",
        designation: "Assistant Professor",
        active: true,
        ratings: {
          marks_rating: 4,
          attendance_rating: 4,
          personality: 4,
          teaching: 2,
          knowledge: 4,
        },
      },
      {
        name: "Dr. John Doe",
        code: "TITJD",
        designation: "Assistant Professor",
        active: false,
        ratings: {
          marks_rating: 4,
          attendance_rating: 4,
          personality: 4,
          teaching: 2,
          knowledge: 4,
        },
      },
    ],
  },
  {
    name: "Compiler Design",
    code: "TIT420",
    description:
      "A compiler translates the code written in one language to some other language without changing the meaning of the program. It is also expected that a compiler should make the target code efficient and optimized in terms of time and space.",
    year: 3,
    credits: 3,
    gate: true,
    practical: true,
    difficulty: 3,
    professors: [
      {
        name: "Prof. Dr. Eng. Ionut Mihai",
        code: "TITS",
        designation: "Assistant Professor",
        active: false,
        ratings: {
          marks_rating: 4,
          attendance_rating: 4,
          personality: 4,
          teaching: 2,
          knowledge: 4,
        },
      },
    ],
  },
];
// let files = [];

app.get("/api/users/get_users", (req, res) => {
  res.json(users);
});
app.post("/api/users/register", (req, res) => {
  let user = req.body.user;
  let newUser = {
    username: user.username,
    password: user.password,
    id: Math.floor(Math.random() * 1000),
  };
  let usernameExists = users.find((u) => u.username === user.username);
  if (usernameExists) res.status(200).send({ msg: "Username taken" });
  users.push(newUser);
  console.log(newUser);
  res.json({ ...newUser });
});
app.get("/api/users/login", (req, res) => {
  let query = req.query;
  let usernameExists = users.find((u) => u.username === query.username);
  let passwordExists = users.find((u) => u.password === query.password);
  if (usernameExists && passwordExists) {
    res.status(200).send({ msg: "User found" });
  } else if (!usernameExists) {
    res.status(401).send({ msg: "Username not found" });
  } else if (!passwordExists) {
    res.status(401).send({ msg: "Wrong password, please try again" });
  }
});
app.get("/api/subjects/get_all_subjects/:year", (req, res) => {
  let year = req.params.year;
  let filteredSubjects = subjects.filter((s) => s.year === parseInt(year));
  res.json({ filteredSubjects, count: filteredSubjects.length });
});
app.get("/api/subjects/get_subject/:code", (req, res) => {
  let code = req.params.code;
  let subject = subjects.find((s) => s.code === code);
  res.json({ subject });
});
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
