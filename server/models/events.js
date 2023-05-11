const mongoose = require("mongoose");

const eventsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  expected_date: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    default: "#",
  },
});

module.exports = mongoose.model("Events", eventsSchema);
