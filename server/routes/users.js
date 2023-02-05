const express = require("express");
const router = express.Router();
const { users } = require("../data");

router.get("/get_users", (req, res) => {
  res.json(users);
});
router.post("/register", (req, res) => {
  let user = req.body.user;
  let newUser = {
    username: user.username,
    password: user.password,
    id: Math.floor(Math.random() * 1000),
    rated_difficulties: [],
  };
  let usernameExists = users.includes((u) => u.username === user.username);
  if (usernameExists) res.status(200).send({ msg: "Username taken" });
  users.push(newUser);
  console.log(newUser);
  res.json({ ...newUser });
});
router.get("/login", (req, res) => {
  let query = req.query;
  let user = users.find(
    (u) => u.username === query.username && u.password === query.password
  );
  if (user) {
    res.status(200).send({ msg: "User found", user });
  } else {
    res.status(401).send({ msg: "Wrong Credentials, please try again" });
  }
});

module.exports = router;
