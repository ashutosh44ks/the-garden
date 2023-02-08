const express = require("express");
const router = express.Router();
const { users, subjects, professors } = require("../data");
const { addToAverage, replaceInAverage } = require("../utils");
const path = require("path");

router.get("/get_all_subjects/:year", (req, res) => {
  let year = req.params.year;
  let filteredSubjects = subjects.filter((s) => s.year === parseInt(year));
  res.json({ filteredSubjects, count: filteredSubjects.length });
});
router.get("/get_subject/:code", (req, res) => {
  let code = req.params.code;
  let subject = subjects.find((s) => s.subject_code === code);
  res.json({ subject });
});

router.post("/rate_difficulty", (req, res) => {
  const { username, subjectCode, userDifficulty } = req.body;

  // get current user and subject
  let user = users.find((u) => u.username === username);
  let subject = subjects.find((s) => s.subject_code === subjectCode);

  if (user === undefined) {
    res.json({ error: "User not found" });
    return;
  }
  if (subject === undefined) {
    res.json({ error: "Subject not found" });
    return;
  }

  let alreadyVoted =
    user.rated_difficulties.find(
      (subj) => subj.subject_code === subjectCode
    ) !== undefined;

  if (alreadyVoted) {
    // update difficulty
    oldRating = user.rated_difficulties.find(
      (subj) => subj.subject_code === subjectCode
    ).difficulty;
    user.rated_difficulties.forEach((subj) => {
      if (subj.subject_code === subjectCode) subj.difficulty = userDifficulty;
    });
    subject.difficulty = replaceInAverage(
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
  }

  // commit in database
  users.forEach((u) => {
    if (u.username === username) u.rated_difficulties = user.rated_difficulties;
  });
  subjects.forEach((s) => {
    if (s.subject_code === subjectCode) s.difficulty = subject.difficulty;
  });

  let newDifficulty = subject.difficulty;

  res.json({
    msg: `Successfully rated ${subject.name} ${userDifficulty} points, new overall rating of the subject is ${newDifficulty}`,
  });
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
