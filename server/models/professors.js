const mongoose = require("mongoose");

const professorsSchema = new mongoose.Schema([
  {
    professor_code: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    designation: String,
    nicknames: [String],
    subjects: [String],
    ratings: {
      marks_rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      attendance_rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      personality: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      teaching: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      knowledge: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      count: {
        type: Number,
        required: true,
      },
    },
  },
]);

module.exports = mongoose.model("Professors", professorsSchema);