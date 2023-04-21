const mongoose = require("mongoose");

const subjectTextsSchema = new mongoose.Schema({
  subject_code: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  created_at: {
    type: String,
    required: true,
  },
  uploader: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("SubjectTexts", subjectTextsSchema);
