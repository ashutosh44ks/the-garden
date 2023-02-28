const express = require("express");
const router = express.Router();
const Users = require("../models/users");

router.get("/get_users", async (req, res) => {
  try {
    const users = await Users.find();
    res.json(users);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// middleware 200 outputs - res.user
const getUserByUsername = async (req, res, next) => {
  let user;
  try {
    user = await Users.find({ username: req.query.username });
    if (user.length === 0) {
      return res.status(404).json({ message: "Cannot find user" });
    }
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
  res.user = user;
  next(); // next() is used to move to the next middleware function or the route handler
};

router.get("/get_user", getUserByUsername, async (req, res) => {
  res.send(res.user);
});

router.post("/register", async (req, res) => {
  let user = req.body.user;
  const newUser = new Users({
    username: user.username,
    password: user.password,
    name: "",
    university_id: "",
    branch: "",
    year: "",
    rated_difficulties: [],
    rated_professors: [],
  });
  let usernameExists = await Users.find({ username: user.username });
  if (usernameExists.length > 0)
    return res.status(400).send({ msg: "Username already exists" });
  try {
    const new_user = await newUser.save();
    res.status(201).json(new_user);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.get("/login", async (req, res) => {
  let user = await Users.find({
    username: req.query.username,
    password: req.query.password,
  });
  if (user.length > 0) {
    res.json({ msg: "Logging in", user: user[0] });
  } else {
    res.status(401).send({ msg: "Wrong Credentials, please try again" });
  }
});

router.delete("/delete_user", async (req, res) => {
  try {
    await Users.findOneAndRemove({
      username: req.query.username,
    });
    res.json({ message: "Deleted User" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.patch("/update_user", async (req, res) => {
  let user = req.body.user;
  if (
    user.name === "" ||
    user.university_id === "" ||
    user.branch === "" ||
    user.year === "" ||
    user.name === undefined ||
    user.university_id === undefined ||
    user.branch === undefined ||
    user.year === undefined
  )
    return res.status(400).send({ msg: "Please fill all the fields" });
  try {
    const updatedUser = await Users.findOne({ username: req.query.username });
    updatedUser.name = user.name;
    updatedUser.university_id = user.university_id;
    updatedUser.branch = user.branch;
    updatedUser.year = user.year;
    updatedUser.save();
    res.json(updatedUser);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

module.exports = router;
