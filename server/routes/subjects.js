const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Subjects = require("../models/subjects");
const Votes = require("../models/votes");
const { authenticateToken } = require("../utils");

// for admin
router.get("/get_subjects", async (req, res) => {
  try {
    const subjects = await Subjects.find();
    res.json({ subjects });
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});
router.post("/add_subject", async (req, res) => {
  console.log(req.body);
  // const newSubject = new Subjects({
  //   subject_code: req.body.subject_code,
  //   name: req.body.name,
  //   description: req.body.description,
  //   branch: req.body.branch,
  //   year: req.body.year,
  //   credits: req.body.credits,
  //   tags: req.body.tags || [],
  //   professors: req.body.professors || [],
  // });
  // try {
  //   const subject = await newSubject.save();
  //   res.status(201).json({ subject });
  // } catch (e) {
  //   res.status(400).json({ msg: e.message });
  // }
});
router.delete("/delete_subject/:code", async (req, res) => {
  try {
    const subject = await Subjects.findOneAndDelete({
      subject_code: req.params.code,
    });
    if (subject === null) {
      return res.status(404).json({ msg: "Cannot find subject" });
    }
    res.json({ subject });
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});

// for users
router.get("/get_tags", authenticateToken, async (req, res) => {
  try {
    const tags = await Subjects.distinct("tags");
    res.json({ tags });
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});
router.post("/get_filtered_subjects", authenticateToken, async (req, res) => {
  let year = req.query.year;
  let filteredSubjects;
  try {
    if (req.body.activeFilters.length === 0)
      filteredSubjects = await Subjects.find({ year: parseInt(year) });
    else
      filteredSubjects = await Subjects.find({
        year: parseInt(year),
        tags: { $in: req.body.activeFilters },
      });
    if (filteredSubjects.length === 0) {
      return res.status(404).json({ message: "Cannot find subject" });
    }
    res.json({ filteredSubjects, count: filteredSubjects.length });
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});
router.get("/get_subject", authenticateToken, async (req, res) => {
  try {
    const subject = await Subjects.findOne({
      subject_code: req.query.subject_code,
    });
    if (subject === null) {
      return res.status(404).json({ message: "Cannot find subject" });
    }
    // get your vote
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    let userVote = await Votes.findOne({
      username: decoded.username,
      subject_code: subject.subject_code,
    });
    if (userVote === null)
      userVote = {
        subject_code: subject.subject_code,
        username: decoded.username,
        vote: 0,
      };
    // get average votes
    const subjectVotes = await Votes.find({
      subject_code: subject.subject_code,
    });
    let avgVotes = 0;
    if (subjectVotes.length !== 0) {
      subjectVotes.forEach((vote) => {
        avgVotes += vote.vote;
      });
      avgVotes /= subjectVotes.length;
    }
    res.json({
      subject,
      userVote: userVote.vote,
      avgVotes,
    });
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});
router.patch("/rate_difficulty", authenticateToken, async (req, res) => {
  const { subjectCode, userDifficulty } = req.body;

  // get username
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  const username = decoded.username;

  try {
    const alreadyVoted = Votes.findOne({
      username: username,
      subject_code: subjectCode,
    }).vote;
    if (alreadyVoted) {
      // update difficulty
      const currentVote = await Votes.findOne({
        username: username,
        subject_code: subjectCode,
      }).vote;
      currentVote.vote = userDifficulty;
      await currentVote.save();
      res.status(200).json({ msg: "Difficulty updated" });
    } else {
      // add new difficulty
      const newVote = new Votes({
        username: username,
        subject_code: subjectCode,
        vote: userDifficulty,
      });
      await newVote.save();
      res.status(200).json({ msg: "Difficulty added" });
    }
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
});
router.get("/view_syllabus/:code", authenticateToken, (req, res) => {
  let code = req.params.code;
  var fileName = `${code}_syllabus.jpg`;
  res.sendFile(fileName, { root: __dirname + "/../data/syllabus/" });
});
router.get("/view_notes/:code", authenticateToken, (req, res) => {
  let code = req.params.code;
  var fileName = `${code}_notes.pdf`;
  res.sendFile(fileName, { root: __dirname + "/../data/notes/" });
});

module.exports = router;
