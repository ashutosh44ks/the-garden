const mongoose = require("mongoose");

const subjectsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  subject_code: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
    min: 1,
    max: 4,
  },
  branch: {
    type: String,
    required: true,
  },
  credits: {
    type: Number,
    required: true,
  },
  tags: [String],
  professors: [
    {
      name: {
        type: String,
        required: true,
      },
      year: {
        type: Number,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Subjects", subjectsSchema);
