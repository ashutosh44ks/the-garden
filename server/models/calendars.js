const mongoose = require("mongoose");

const calendarsSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  downloadUrl: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Calendars", calendarsSchema);
