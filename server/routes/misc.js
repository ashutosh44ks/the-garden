const express = require("express");
const router = express.Router();
const Events = require("../models/events");
const { authenticateToken, forModOnly } = require("../utils");

router.get("/get_events", authenticateToken, async (req, res) => {
  try {
    const list = await Events.find();
    if (list.length === 0)
      return res.status(404).json({ msg: "No events found" });
    res.json(list);
  } catch (err) {
    console.log(err);
    res.status(500).json(temp);
  }
});
router.post("/add_event", authenticateToken, forModOnly, async (req, res) => {
  try {
    const { event } = req.body;
    const newEvent = new Events(event);
    await newEvent.save();
    res.json({ msg: "Event added successfully" });
  } catch(e) {
    console.log(e);
    res.status(500).json({ msg: e.message });
  }
});

module.exports = router;
