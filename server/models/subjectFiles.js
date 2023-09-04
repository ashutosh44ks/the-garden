const mongoose = require("mongoose");

const subjectFilesSchema = new mongoose.Schema({
  downloadUrl: {
    type: String,
    required: true,
    unique: true,
  },
  dbFileName: {
    type: String,
    required: true,
    unique: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  uploader: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("SubjectFiles", subjectFilesSchema);
