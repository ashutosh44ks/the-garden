const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const { authenticateToken, forModOnly, getFiles } = require("../utils");
const SubjectFiles = require("../models/subjectFiles");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const subject_code = req.body.subject_code;
    const dest = `./data/${subject_code}`;
    // create directory if it doesn't exist
    fs.mkdirSync(dest, { recursive: true });
    // set destination for multer
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    const category = req.body.category;
    const year = req.body.year;
    if (
      file.mimetype.split("/")[1] ===
      "vnd.openxmlformats-officedocument.wordprocessingml.document"
    )
      cb(null, `${category}_${year}_${Date.now()}.docx`);
    else
      cb(
        null,
        `${category}_${year}_${Date.now()}.${file.mimetype.split("/")[1]}`
      );
  },
});
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/png",
    "image/jpg",
  ];
  if (allowedMimeTypes.includes(file.mimetype)) cb(null, true); // accept file
  else {
    req.fileValidationError = "Forbidden extension";
    req.allowedMimeTypes = allowedMimeTypes;
    cb(null, false, req.fileValidationError, req.allowedMimeTypes); // reject file
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB
  },
  fileFilter: fileFilter,
});
router.post(
  "/upload_file",
  authenticateToken,
  upload.single("file"),
  async (req, res) => {
    if (req.fileValidationError)
      return res.status(422).json({
        msg: req.fileValidationError,
        allowedMimeTypes: req.allowedMimeTypes,
      });
    const newSubjectFile = new SubjectFiles({
      dbFileName: req.file.filename,
      userFileName: req.body.filename,
      uploader: req.user.username,
      subject_code: req.body.subject_code,
    });
    try {
      const uploadedFile = await newSubjectFile.save();
      res.status(201).json({ msg: "File uploaded successfully", uploadedFile });
    } catch (e) {
      // delete the file if it was uploaded
      fs.unlink(req.file.path, (err) => {
        if (err) console.log(err);
      });
      res.status(400).json({ msg: e.message });
    }
  }
);
router.get("/get_dir_files", authenticateToken, async (req, res) => {
  const subject_code = req.query.subject_code;
  const prefix = req.query.prefix;
  const allowedPrefixes = ["qp", "syllabus", "notes", "other"];
  if (!allowedPrefixes.includes(prefix))
    res.status(422).json({ msg: "Enter a valid prefix", allowedPrefixes });

  // const all_files = fs.readdirSync(`./data/${subject_code}`);
  const all_files = await SubjectFiles.find({
    subject_code: subject_code,
  });
  const my_files = all_files.filter((file) =>
    file.dbFileName.startsWith(prefix)
  );

  const list = my_files.map((file) => {
    return {
      dbFileName: file.dbFileName,
      userFileName: file.userFileName,
      uploader: file.uploader,
    };
  });
  res.status(200).json({ list });
});
router.get("/get_file", authenticateToken, (req, res) => {
  const subject_code = req.query.subject_code;
  const fileName = req.query.file_name;
  res.sendFile(fileName, { root: __dirname + `/../data/${subject_code}` });
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

router.delete(
  "/remove_file",
  authenticateToken,
  forModOnly,
  async (req, res) => {
    const subject_code = req.query.subject_code;
    const fileName = req.query.dbFileName;
    try {
      const deletedFile = await SubjectFiles.findOne({
        subject_code: subject_code,
        dbFileName: fileName,
      });
      if (!deletedFile)
        return res.status(404).json({ msg: "File not found in database" });
      deletedFile.remove();
      fs.unlink(`./data/${subject_code}/${fileName}`, (err) => {
        if (err) console.log(err);
      });
      res.status(200).json({ msg: "File deleted successfully" });
    } catch (e) {
      res.status(400).json({ msg: e.message });
    }
  }
);

router.get(
  "/get_all_dir_files",
  authenticateToken,
  forModOnly,
  async (req, res) => {
    try {
      let dbFiles = getFiles("./data");
      if (!dbFiles)
        return res.status(404).json({ msg: "No files found in db server" });
      const all_files = await SubjectFiles.find();
      if (!all_files)
        return res.status(404).json({ msg: "No files found in db" });
      let temp = all_files
        .filter((file) =>
          dbFiles.find((dbFile) => dbFile.dbFileName === file.dbFileName)
        )
        .map((file) => {
          let dbFile = dbFiles.find(
            (dbFile) => dbFile.dbFileName === file.dbFileName
          );
          if (dbFile)
            return {
              ...file._doc,
              size: dbFile.size,
            };
        });
      res.status(200).json(temp);
    } catch (e) {
      res.status(400).json({ msg: e.message });
    }
  }
);

module.exports = router;
