const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  university_id: {
    type: Number,
    unique: true,
    min: 54000,
    max: 70000,
  },
  branch: {
    type: String,
  },
  year: {
    type: Number,
    min: 1,
    max: 4,
  },
  rated_difficulties: [
    {
      subject_code: {
        type: String,
        required: true,
      },
      difficulty: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
    },
  ],
  rated_professors: [
    {
      professor_code: {
        type: String,
        required: true,
      },
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
    },
  ],
});

module.exports = mongoose.model("Users", usersSchema);
