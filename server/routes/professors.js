const express = require("express");
const router = express.Router();
const { professors, users } = require("../data");
const { addToAverage, replaceInAverage } = require("../utils");

router.get("/get_professor_details/:professorCode", (req, res) => {
  const professorCode = req.params.professorCode;
  const professor = professors.find(
    (professor) => professor.code === professorCode
  );
  if (!professor) return res.status(404).send("Professor not found");
  res.json(professor);
});

router.get("/get_professors_by_subject/:subjectCode", (req, res) => {
  const subjectCode = req.params.subjectCode;
  const professorList = professors.filter((professor) =>
    professor.subjects.includes(subjectCode)
  );
  if (!professorList) return res.status(404).send("Professors not found");
  res.json(professorList);
});

router.put("/update_professor_ratings/:professorCode", (req, res) => {
  // this has lots of bugs
  // set initial count to 2 in professors
  const professorCode = req.params.professorCode;
  const professor = professors.find(
    (professor) => professor.code === professorCode
  );
  if (!professor) return res.status(404).send("Professor not found");
  const { ratings, username } = req.body;
  let user = users.find((u) => u.username === username);
  if (!user) return res.status(404).send("User not found");

  let alreadyVoted =
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
  }

  // commit in database
  users.forEach((u) => {
    if (u.username === username) u.rated_professors = user.rated_professors;
  });
  professors.forEach((p) => {
    if (p.code === professorCode) p.ratings = professor.ratings;
  });

  res.json(professor);
});

module.exports = router;
