const express = require("express");
const router = express.Router();
const { authenticateToken, forModOnly } = require("../utils");
const Calendars = require("../models/calendars");

router.post(
  "/upload_calendar",
  authenticateToken,
  forModOnly,
  async (req, res) => {
    try {
      const myCalendar = new Calendars({
        type: req.body.type,
        downloadUrl: req.body.downloadUrl,
      });
      myCalendar.save();
      res.status(201).json({ msg: "Successfully uploaded", data: myCalendar });
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
  }
);

router.get("/get_calendar", authenticateToken, async (req, res) => {
  try {
    const myCalendar = await Calendars.findOne({ type: req.query.type });
    if (myCalendar === null) {
      res.status(404).json({ msg: "No calendar found" });
      return;
    }
    res.status(200).json(myCalendar.downloadUrl);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

module.exports = router;
