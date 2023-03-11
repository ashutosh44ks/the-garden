const express = require("express");
const router = express.Router();
const Users = require("../models/users");
const RefreshTokens = require("../models/refresh");

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

router.delete("/delete_user", async (req, res) => {
  try {
    const refreshToken = req.body.token;
    await RefreshTokens.deleteOne({ refreshToken: refreshToken });
    res.status(200).json({ msg: "User deleted" });
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
