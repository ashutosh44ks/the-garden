const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const { authenticateToken } = require("../utils");
// const jwt = require("jsonwebtoken");
// const Subjects = require("../models/subjects");

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
    cb(
      null,
      category + "_" + year + Date.now() + "." + file.mimetype.split("/")[1]
    );
  },
});
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/jpg",
  ];
  if (allowedMimeTypes.includes(file.mimetype)) cb(null, true); // accept file
  else cb(null, false); // reject file
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
    res.json({ msg: "File uploaded" });
  }
);
router.get("/get_dir_files", (req, res) => {
  const subject_code = req.query.subject_code;
  const prefix = req.query.prefix;
  const allowedPrefixes = ["qp", "syllabus", "notes"];
  if (!allowedPrefixes.includes(prefix))
    res.status(422).json({ msg: "Enter a valid prefix", allowedPrefixes });
  const files = fs.readdirSync(`./data/${subject_code}`);
  res.json({ list: files.filter((file) => file.startsWith(prefix)) });
});
router.get("/get_file", authenticateToken, (req, res) => {
  const subject_code = req.query.subject_code;
  const fileName = req.query.file_name;
  res.sendFile(fileName, { root: __dirname + `/../data/${subject_code}` });
});

module.exports = router;
