const mongoose = require("mongoose");

const subjectFilesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  dbFullPath: {
    type: String,
    required: true,
    unique: true,
  },
  downloadUrl: {
    type: String,
    required: true,
    unique: true,
  },
  size: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  uploader: {
    type: String,
    required: true,
  },
  created_at: {
    type: String,
    default: Date.now(),
  },
});

module.exports = mongoose.model("SubjectFiles", subjectFilesSchema);
