const express = require("express");
const router = express.Router();
const Subjects = require("../models/subjects");
const Users = require("../models/users");
const { addToAverage, replaceInAverage } = require("../utils");

router.get("/get_all_subjects/:year", async (req, res) => {
  let year = req.params.year;
  let filteredSubjects;
  try {
    filteredSubjects = await Subjects.find({ year: parseInt(year) });
    if (filteredSubjects.length === 0) {
      return res.status(404).json({ message: "Cannot find subjects" });
    }
    res.json({ filteredSubjects, count: filteredSubjects.length });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post("/get_filtered_subjects/:year", async (req, res) => {
  let year = req.params.year;
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
      return res.status(404).json({ message: "Cannot find subjects" });
    }
    res.json({ filteredSubjects, count: filteredSubjects.length });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post("/set_subject/:code", async (req, res) => {
  const newSubject = new Subjects({
    name: req.body.name,
    subject_code: req.params.code,
    description: req.body.description,
    year: req.body.year,
    credits: req.body.credits,
    tags: req.body.tags,
    difficulty: req.body.difficulty,
    ratings_count: 1,
    professors: []
  });
  try {
    const subject = await newSubject.save();
    res.status(201).json({ subject });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.delete("/delete_subject/:code", async (req, res) => {
  try {
    const subject = await Subjects.findOneAndDelete({
      subject_code: req.params.code,
    });
    if (subject === null) {
      return res.status(404).json({ message: "Cannot find subject" });
    }
    res.json({ subject });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get("/get_subject/:code", async (req, res) => {
  try {
    const subject = await Subjects.findOne({ subject_code: req.params.code });
    if (subject.length === 0) {
      return res.status(404).json({ message: "Cannot find subject" });
    }
    res.json({ subject });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.patch("/rate_difficulty", async (req, res) => {
  const { username, subjectCode, userDifficulty } = req.body;
  try {
    // get current user and subject
    const user = await Users.findOne({ username: username });
    const subject = await Subjects.findOne({ subject_code: subjectCode });

    if (user === null) {
      return res.status(404).json({ message: "Cannot find user" });
    }
    if (subject === null) {
      return res.status(404).json({ message: "Cannot find subject" });
    }

    const alreadyVoted =
      user.rated_difficulties.find(
        (subj) => subj.subject_code === subjectCode
      ) !== undefined;

    if (alreadyVoted) {
      // update difficulty
      let oldRating = user.rated_difficulties.find(
        (subj) => subj.subject_code === subjectCode
      ).difficulty;
      user.rated_difficulties.forEach((subj) => {
        if (subj.subject_code === subjectCode) subj.difficulty = userDifficulty;
      });
      console.log(
        subject.difficulty,
        subject.ratings_count,
        oldRating,
        userDifficulty
      );
      subject.difficulty = replaceInAverage(
        subject.difficulty,
        subject.ratings_count,
        oldRating,
        userDifficulty
      );
      console.log(
        subject.difficulty,
        subject.ratings_count,
        oldRating,
        userDifficulty
      );
    } else {
      // add new difficulty
      user.rated_difficulties.push({
        subject_code: subjectCode,
        difficulty: userDifficulty,
      });
      subject.difficulty = addToAverage(
        subject.difficulty,
        subject.ratings_count,
        userDifficulty
      );
      subject.ratings_count += 1;
    }

    // commit in database
    await user.save();
    await subject.save();
    let newDifficulty = subject.difficulty;
    res.json({
      msg: `Successfully rated ${subject.name} ${userDifficulty} points, new overall rating of the subject is ${newDifficulty}`,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get("/view_syllabus/:code", (req, res) => {
  let code = req.params.code;
  var fileName = `${code}_syllabus.jpg`;
  res.sendFile(fileName, { root: __dirname + "/../data/syllabus/" });
});

router.get("/view_notes/:code", (req, res) => {
  let code = req.params.code;
  var fileName = `${code}_notes.pdf`;
  res.sendFile(fileName, { root: __dirname + "/../data/notes/" });
});

module.exports = router;
