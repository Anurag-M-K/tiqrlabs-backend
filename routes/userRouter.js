const express = require("express");
const { signup, login , getAllUsers ,invitation , getAllInvitations,rejectInvitation , acceptedInvitation} = require("../controller/userController");
const { verifyJWT } = require("../middleware/authMiddleware");
const router = express.Router();

router.post('/signup',signup);
router.post('/login',login);
router.get("/allusers",verifyJWT , getAllUsers);
router.post("/invite/:id",verifyJWT,invitation)
router.get("/getallinvitations",verifyJWT,getAllInvitations);
router.delete("/rejectinvitation/:id",verifyJWT,rejectInvitation)
router.put("/acceptedInvitation/:id",verifyJWT,acceptedInvitation)


module.exports = router;