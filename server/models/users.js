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
  role: {
    type: String,
    default: "user",
  },
});

module.exports = mongoose.model("Users", usersSchema);
