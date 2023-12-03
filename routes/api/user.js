const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");
const { validateRegisterUser } = require("../../services/schemas/joiUserSchema");

const { current, signup, login, logout, updateAvatar, verifyEmailUser, resendVerifyEmail } = require("../../controllers/auth/index");
const multer = require("../../middlewares/multer");

router.post("/signup", validateRegisterUser, signup);

router.post("/login", login);

router.post("/logout", auth, logout);

router.get("/current", auth, current);

router.patch("/avatars", auth, multer, updateAvatar);

router.get("/account/verify/:verificationToken", verifyEmailUser);

router.post("/verify", resendVerifyEmail);

module.exports = router;
