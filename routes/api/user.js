const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");
const { validateRegisterUser } = require("../../services/schemas/joiUserSchema");

const { current, signup, login, logout, updateAvatar } = require("../../controllers/auth/index");
const multer = require("../../middlewares/multer");

router.post("/signup", validateRegisterUser, signup);

router.post("/login", login);

router.post("/logout", auth, logout);

router.get("/current", auth, current);

router.patch("/avatars", auth, multer, updateAvatar);

module.exports = router;
