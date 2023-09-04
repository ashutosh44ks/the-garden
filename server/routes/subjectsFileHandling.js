const express = require("express");
const router = express.Router();
const { authenticateToken, forModOnly } = require("../utils");
const SubjectFiles = require("../models/subjectFiles");

router.post("/upload_file", authenticateToken, async (req, res) => {
  try {
    const newSubjectFile = new SubjectFiles({
      downloadUrl: req.body.downloadUrl,
      dbFileName: req.body.dbFileName,
      fileName: req.body.fileName,
      uploader: req.user.username,
    });
    const uploadedFile = await newSubjectFile.save();
    res.status(201).json({ msg: "File uploaded successfully", uploadedFile });
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});
router.get("/get_dir_files", authenticateToken, async (req, res) => {
  const subject_code = req.query.subject_code;
  const prefix = req.query.prefix;
  const allowedPrefixes = ["qp", "syllabus", "notes", "other"];
  if (!allowedPrefixes.includes(prefix))
    res.status(422).json({ msg: "Enter a valid prefix", allowedPrefixes });
  const all_files = await SubjectFiles.find({
    subject_code: subject_code,
  });
  const list = all_files.filter((file) => file.dbFileName.startsWith(prefix));
  res.status(200).json({ list });
});

router.delete(
  "/remove_file",
  authenticateToken,
  forModOnly,
  async (req, res) => {
    const dbFileName = req.query.dbFileName;
    try {
      const deletedFile = await SubjectFiles.findOne({
        dbFileName,
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
// done & tested above

// router.get("/get_file", authenticateToken, (req, res) => {
//   const subject_code = req.query.subject_code;
//   const fileName = req.query.file_name;
//   res.sendFile(fileName, { root: __dirname + `/../data/${subject_code}` });
// });

// router.get("/view_syllabus/:code", authenticateToken, (req, res) => {
//   let code = req.params.code;
//   var fileName = `${code}_syllabus.jpg`;
//   res.sendFile(fileName, { root: __dirname + "/../data/syllabus/" });
// });
// router.get("/view_notes/:code", authenticateToken, (req, res) => {
//   let code = req.params.code;
//   var fileName = `${code}_notes.pdf`;
//   res.sendFile(fileName, { root: __dirname + "/../data/notes/" });
// });

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
