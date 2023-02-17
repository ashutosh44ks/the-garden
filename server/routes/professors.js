const express = require("express");
const router = express.Router();
const Professors = require("../models/professors");
const Users = require("../models/users");
const { addToAverage, replaceInAverage } = require("../utils");

router.get("/get_professors", async (req, res) => {
  try {
    const professorList = await Professors.find();
    res.json(professorList);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/get_professor_details/:professorCode", async (req, res) => {
  const professorCode = req.params.professorCode;
  try {
    const professor = await Professors.findOne({
      professor_code: professorCode,
    });
    if (professor === null) return res.status(404).send("Professor not found");
    res.json(professor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/add_professor", async (req, res) => {
  try {
    const newProfessor = new Professors({
      professor_code: req.body.professor_code,
      name: req.body.name,
      designation: req.body.designation,
      nicknames: req.body.nicknames,
      subjects: req.body.subjects,
      ratings: {
        marks_rating: req.body.ratings.marks_rating,
        attendance_rating: req.body.ratings.attendance_rating,
        personality: req.body.ratings.personality,
        teaching: req.body.ratings.teaching,
        knowledge: req.body.ratings.knowledge,
        count: 1,
      },
    });
    const professorExists = await Professors.findOne({
      professor_code: req.body.code,
    });
    if (professorExists)
      return res.status(400).send("Professor already exists");
    const savedProfessor = await newProfessor.save();
    res.status(201).json(savedProfessor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/get_professors_by_subject/:subjectCode", async (req, res) => {
  const subjectCode = req.params.subjectCode;
  try {
    const professorList = await Professors.find({ subjects: subjectCode });
    if (!professorList) return res.status(404).send("Professors not found");
    res.json(professorList);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/update_professor_ratings/:professorCode", async (req, res) => {
  // this has lots of bugs
  // set initial count to 2 in professors
  try {
    const professorCode = req.params.professorCode;
    const professor = await Professors.findOne({ professor_code: professorCode });
    if (professor === null) return res.status(404).send("Professor not found");
    const { ratings, username } = req.body;
    const user = await Users.findOne({username: username});
    if (user === null) return res.status(404).send("User not found");

    const alreadyVoted =
      user.rated_professors.find(
        (prof) => prof.professor_code === professorCode
      ) !== undefined;

    if (alreadyVoted) {
      // update difficulty
      let oldRating = user.rated_professors.find(
        (prof) => prof.professor_code === professorCode
      );
      professor.ratings.marks_rating = replaceInAverage(
        professor.ratings.marks_rating,
        professor.ratings.count,
        oldRating.marks_rating,
        ratings.marks_rating
      );
      professor.ratings.attendance_rating = replaceInAverage(
        professor.ratings.attendance_rating,
        professor.ratings.count,
        oldRating.attendance_rating,
        ratings.attendance_rating
      );
      professor.ratings.personality = replaceInAverage(
        professor.ratings.personality,
        professor.ratings.count,
        oldRating.personality,
        ratings.personality
      );
      professor.ratings.teaching = replaceInAverage(
        professor.ratings.teaching,
        professor.ratings.count,
        oldRating.teaching,
        ratings.teaching
      );
      professor.ratings.knowledge = replaceInAverage(
        professor.ratings.knowledge,
        professor.ratings.count,
        oldRating.knowledge,
        ratings.knowledge
      );
      user.rated_professors.forEach((prof) => {
        if (prof.professor_code === professorCode) {
          prof.marks_rating = ratings.marks_rating;
          prof.attendance_rating = ratings.attendance_rating;
          prof.personality = ratings.personality;
          prof.teaching = ratings.teaching;
          prof.knowledge = ratings.knowledge;
        }
      });
    } else {
      // add new difficulty
      user.rated_professors.push({
        professor_code: professorCode,
        marks_rating: ratings.marks_rating,
        attendance_rating: ratings.attendance_rating,
        personality: ratings.personality,
        teaching: ratings.teaching,
        knowledge: ratings.knowledge,
      });
      professor.ratings.marks_rating = addToAverage(
        professor.ratings.marks_rating,
        professor.ratings.count,
        ratings.marks_rating
      );
      professor.ratings.attendance_rating = addToAverage(
        professor.ratings.attendance_rating,
        professor.ratings.count,
        ratings.attendance_rating
      );
      professor.ratings.personality = addToAverage(
        professor.ratings.personality,
        professor.ratings.count,
        ratings.personality
      );
      professor.ratings.teaching = addToAverage(
        professor.ratings.teaching,
        professor.ratings.count,
        ratings.teaching
      );
      professor.ratings.knowledge = addToAverage(
        professor.ratings.knowledge,
        professor.ratings.count,
        ratings.knowledge
      );
      professor.ratings.count += 1;
    }

    // commit in database
    await professor.save();
    await user.save();

    res.status(200).json(professor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
