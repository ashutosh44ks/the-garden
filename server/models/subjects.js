const mongoose = require("mongoose");

const subjectsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
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
  credits: {
    type: Number,
    required: true,
  },
  gate: {
    type: Boolean,
    required: true,
  },
  practical: {
    type: Boolean,
    required: true,
  },
  difficulty: {
    type: Number,
    required: true,
    min: 1,
    max: 3,
  },
  ratings_count: {
    type: Number,
    required: true,
  },
  professors: [String],
});

module.exports = mongoose.model("Subjects", subjectsSchema);