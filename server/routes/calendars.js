const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const { authenticateToken } = require("../utils");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dest = `./data/calendars`;
    // create directory if it doesn't exist
    fs.mkdirSync(dest, { recursive: true });
    // set destination for multer
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    const calendar_type = req.body.calendar_type;
    cb(null, `${calendar_type}.${file.mimetype.split("/")[1]}`);
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") cb(null, true); // accept file
  else {
    req.fileValidationError = "Forbidden extension";
    req.allowedMimeTypes = ["application/pdf"];
    cb(null, false, req.fileValidationError, req.allowedMimeTypes); // reject file
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 8 * 1024 * 1024, // 8MB
  },
  fileFilter: fileFilter,
});
router.post(
  "/upload_calendar",
  authenticateToken,
  upload.single("file"),
  async (req, res) => {
    if (req.fileValidationError)
      return res.status(422).json({
        msg: req.fileValidationError,
        allowedMimeTypes: req.allowedMimeTypes,
      });
    res.status(201).json({ msg: "Successfully uploaded" });
  }
);

router.get("/get_calendar", authenticateToken, (req, res) => {
  const calendar_type = req.query.calendar_type;
  var fileName = `${calendar_type}.pdf`;
  res.sendFile(fileName, { root: __dirname + `/../data/calendars` });
});

module.exports = router;
