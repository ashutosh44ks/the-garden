const express = require("express");
const router = express.Router();
const { authenticateToken, forModOnly } = require("../utils");
const SubjectFiles = require("../models/subjectFiles");

router.post("/upload_file_ref", authenticateToken, async (req, res) => {
  try {
    const newSubjectFile = new SubjectFiles(req.body);
    const uploadedFile = await newSubjectFile.save();
    res.status(201).json({ msg: "File uploaded successfully", uploadedFile });
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});
router.get("/get_dir_files", authenticateToken, async (req, res) => {
  try {
    const subject_code = req.query.subject_code;
    const prefix = req.query.prefix;
    const allowedPrefixes = ["qp", "syllabus", "notes", "other"];
    if (!allowedPrefixes.includes(prefix))
      res.status(422).json({ msg: "Enter a valid prefix", allowedPrefixes });
    const all_files = await SubjectFiles.find();
    if (!all_files)
      return res.status(404).json({ msg: "No files found in db" });

    const list = all_files.filter((file) => {
      let dbFileName =
        file.dbFullPath.split("/")[file.dbFullPath.split("/").length - 1];
      let subjectCode = file.dbFullPath.split("/")[0];
      if (subjectCode === subject_code && dbFileName.split("_")[0] === prefix)
        return true;
      else return false;
    });

    if (!list.length)
      return res
        .status(404)
        .json({
          msg: `No files found in db for ${prefix} && ${subject_code}`,
        });
    res.status(200).json({ list });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

router.delete(
  "/remove_file_ref",
  authenticateToken,
  forModOnly,
  async (req, res) => {
    const dbFullPath = req.query.dbFullPath;
    try {
      const deletedFile = await SubjectFiles.findOne({
        dbFullPath,
      });
      if (!deletedFile)
        return res.status(404).json({ msg: "File not found in database" });
      deletedFile.remove();
      res.status(200).json({ msg: "File deleted successfully" });
    } catch (e) {
      res.status(400).json({ msg: e.message });
    }
  }
);

// router.get(
//   "/get_all_dir_files",
//   authenticateToken,
//   forModOnly,
//   async (req, res) => {
//     try {
//       let dbFiles = getFiles("./data");
//       if (!dbFiles)
//         return res.status(404).json({ msg: "No files found in db server" });
//       const all_files = await SubjectFiles.find();
//       if (!all_files)
//         return res.status(404).json({ msg: "No files found in db" });
//       let temp = all_files
//         .filter((file) =>
//           dbFiles.find((dbFile) => dbFile.dbFileName === file.dbFileName)
//         )
//         .map((file) => {
//           let dbFile = dbFiles.find(
//             (dbFile) => dbFile.dbFileName === file.dbFileName
//           );
//           if (dbFile)
//             return {
//               ...file._doc,
//               size: dbFile.size,
//             };
//         });
//       res.status(200).json(temp);
//     } catch (e) {
//       res.status(400).json({ msg: e.message });
//     }
//   }
// );

module.exports = router;
