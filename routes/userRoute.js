const express = require("express")
const { registerUser, loginUser, currentUser, getToken } = require("../controllers/userController")
const validateToken = require("../middleware/validateTokenHandler")

const router = express.Router()


router.post("/register", registerUser)

router.post("/login",loginUser)

router.get("/current", validateToken, currentUser)

router.post("/token", getToken)

module.exports = router