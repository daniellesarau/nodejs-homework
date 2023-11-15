const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");
const { validateRegisterUser } = require("../../services/schemas/joiUserSchema");
const { current, signup, login, logout } = require("../../controllers/auth/index");

router.post("/signup", validateRegisterUser, signup);

router.post("/login", login);

router.post("/logout", auth, logout);

router.get("/current", auth, current);

module.exports = router;
