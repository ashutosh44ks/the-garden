const express = require("express");
const router = express.Router();
const Users = require("../models/users");
const RefreshTokens = require("../models/refresh");
const { authenticateToken, forModOnly } = require("../utils");

// for admin
router.get("/get_users", authenticateToken, forModOnly, async (req, res) => {
  try {
    const users = await Users.find();
    res.json(users);
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});
router.delete(
  "/delete_user",
  authenticateToken,
  forModOnly,
  async (req, res) => {
    try {
      const username = req.query.username;
      const targetToken = await RefreshTokens.findOne({ username });
      const targetUser = await Users.findOne({ username });
      if (targetToken && targetUser) {
        targetToken.delete();
        targetUser.delete();
      }
      res.status(200).json({ msg: "User deleted" });
    } catch (e) {
      res.status(500).json({ msg: e.message });
    }
  }
);
router.patch(
  "/alt_update_user",
  authenticateToken,
  forModOnly,
  async (req, res) => {
    const username = req.body.username;
    const action = req.body.action;
    if (username === undefined || action === undefined)
      return res
        .status(422)
        .json({ msg: "Missing either username and/or action" });
    if (action && action !== "promote" && action !== "demote")
      return res.status(422).json({ msg: "Invalid action." });
    try {
      const targetUser = await Users.findOne({ username });
      if (targetUser == null) {
        return res.status(404).json({ msg: "Cannot find user" });
      }
      const currentUserRole = req.user.role;
      if (action === "promote") {
        if (targetUser.role === "mod" && currentUserRole === "admin")
          targetUser.role = "admin";
        else if (targetUser.role === "user") targetUser.role = "mod";
        else res.json("Something went wrong");
      }
      if (action === "demote") {
        if (targetUser.role === "mod" && currentUserRole === "admin")
          targetUser.role = "user";
        else res.json("Something went wrong");
      }
      await targetUser.save();
      res.json(targetUser);
    } catch (e) {
      res.status(400).json({ msg: e.message });
    }
  }
);

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
  if (user === undefined)
    return res
      .status(422)
      .json({ msg: "Please enter a valid user in request body" });
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
