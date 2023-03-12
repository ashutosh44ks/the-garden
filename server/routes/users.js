const express = require("express");
const router = express.Router();
const Users = require("../models/users");
const RefreshTokens = require("../models/refresh");
const { authenticateToken } = require("../utils");

// for admin
router.get("/get_users", async (req, res) => {
  try {
    const users = await Users.find();
    res.json(users);
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});
router.delete("/delete_user", async (req, res) => {
  try {
    const refreshToken = req.body.token;
    await RefreshTokens.deleteOne({ refreshToken: refreshToken });
    res.status(200).json({ msg: "User deleted" });
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});

// for users
router.get("/get_user", authenticateToken, async (req, res) => {
  try {
    const user = await Users.findOne({ username: req.query.username });
    if (user == null) {
      return res.status(404).json({ msg: "Cannot find user" });
    }
    res.json(user);
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});
router.patch("/update_user", authenticateToken, async (req, res) => {
  const user = req.body.user;
  try {
    const currentUser = await Users.findOne({ username: req.query.username });
    if (currentUser == null) {
      return res.status(404).json({ msg: "Cannot find user" });
    }
    if (user.name != null) currentUser.name = user.name;
    if (user.university_id != null)
      currentUser.university_id = user.university_id;
    if (user.branch != null) currentUser.branch = user.branch;
    if (user.year != null) currentUser.year = user.year;
    await currentUser.save();
    res.json(currentUser);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

module.exports = router;
