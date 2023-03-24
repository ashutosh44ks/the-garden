const mongoose = require("mongoose");

const votesSchema = new mongoose.Schema({
  subject_code: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  vote: {
    type: Number,
    required: true,
    min: 1,
    max: 3,
  },
});
module.exports = mongoose.model("Votes", votesSchema);
