const mongoose = require("mongoose");

const subjectFilesSchema = new mongoose.Schema({
  dbFileName: {
    type: String,
    required: true,
    unique: true,
  },
  userFileName: {
    type: String,
  },
  uploader: {
    type: String,
    required: true,
  },
  subject_code: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model("SubjectFiles", subjectFilesSchema);
