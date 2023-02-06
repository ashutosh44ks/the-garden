const express = require("express");
const router = express.Router();
const { professors } = require("../data");

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
  const professorList = professors.filter(
    (professor) => professor.subjects.includes(subjectCode)
  );
  if (!professorList) return res.status(404).send("Professors not found");
  res.json(professorList);
})

module.exports = router;
