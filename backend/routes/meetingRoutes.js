const express = require("express");
const router = express.Router();
const meetingController = require("../controllers/meetingController");

// Book a new meeting
router.post("/book", meetingController.bookMeeting);

// Get all meetings (Admin)
router.get("/all", meetingController.getAllMeetings);

// Delete a meeting
router.delete("/:id", meetingController.deleteMeeting);

module.exports = router;
