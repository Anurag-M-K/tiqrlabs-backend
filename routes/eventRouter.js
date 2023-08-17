const express = require("express");
const { verifyJWT } = require("../middleware/authMiddleware");
const { addEvent , getAllEvents } = require("../controller/eventController");
const router = express.Router()

router.post("/addevent", verifyJWT, addEvent)
router.get("/getallevents",verifyJWT,getAllEvents)
module.exports = router;