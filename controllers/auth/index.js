const { getUser, updateUser, register, verifyEmail, sendEmail } = require("../../services/authenticate");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Jimp = require("jimp");
const { nanoid } = require("nanoid");
const fs = require("fs");
const path = require("path");

const current = async ({ user: { email, subscription } }, res, next) => {
 try {
  return res.json({
   status: "Success",
   code: 200,
   data: {
    result: { email, subscription },
   },
  });
 } catch (error) {
  next(error);
 }
};

const signup = async ({ body: { email, password } }, res, next) => {
 try {
  const user = await getUser({ email });
  if (user) {
   return res.status(409).json({
    status: "Conflict",
    code: 409,
    message: "Email in use",
   });
  }

  const results = await register({ email, password });

  return res.status(201).json({
   status: "Created",
   code: 201,
   data: { email: results.email, subscription: results.subscription, avatarUrl: results.avatarUrl, verify: results.verify, verificationToken: results.verificationToken },
  });
 } catch (error) {
  next(error);
 }
};

const login = async ({ body: { email, password } }, res, next) => {
 try {
  const user = await getUser({ email });

  if (!user || !user.comparePassword(password)) {
   return res.status(400).json({
    status: "Unauthorized",
    code: 401,
    message: "Email or password is wrong",
   });
  }

  const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
  await updateUser(user._id, { token });

  return res.json({
   status: "Success",
   code: 200,
   data: {
    token,
    email: user.email,
    subscription: user.subscription,
   },
  });
 } catch (error) {
  next(error);
 }
};

const logout = async ({ user: { id } }, res, next) => {
 try {
  await updateUser(id, { token: null });

  return res.json({
   status: "Success",
   code: 204,
  });
 } catch (error) {
  next(error);
 }
};

const updateAvatar = async (req, res, next) => {
 try {
  if (!req.file) {
   return res.status(401).json({
    status: "Unauthorized",
    code: 401,
   });
  }

  const uniqFilename = `${req.user._id}-${Date.now()}${path.extname(req.file.originalname)}`;
  const destinationPath = path.join(__dirname, `../public/avatars/${uniqFilename}`);

  await Jimp.read(req.file.path)
   .then((image) => {
    return image.resize(250, 250).quality(60).greyscale().writeAsync(destinationPath);
   })
   .then(() => {
    fs.unlinkSync(req.file.path);
   })
   .catch((error) => {
    throw error;
   });

  req.user.avatarUrl = `/avatars/${uniqFilename}`;
  await req.user.save();

  res.status(200).json({
   status: "Succes",
   code: 200,
   avatarUrl: req.user.avatarUrl,
  });
 } catch (error) {
  res.status(404).json({ error: error.message });
  next(error);
 }
};

const verifyEmailUser = async (req, res, next) => {
 try {
  const { verificationToken } = req.params;
  await verifyEmail(verificationToken);

  res.status(200).json({ mesaj: "Verification successful!!! ", code: 200 });
 } catch (error) {
  res.status(404).json({
   status: "error",
   message: "User not found",
  });
 }
};

const resendVerifyEmail = async (req, res, next) => {
 try {
  const { email } = req.body;
  if (!email) {
   return res.status(400).json({ message: "Missing required field: email" });
  }
  const user = await getUser({ email });

  if (!user) {
   return res.status(404).json({ message: "Email not found" });
  }
  if (user.verify) {
   return res.status(400).json({ message: "Verification has already been passed" });
  }
  const verificationToken = nanoid();
  const verifyEmail = {
   to: email,
   from: "saraudaniela@gmail.com",
   subject: "Verify email!",
   text: `Your verification code is ${verificationToken} / http://localhost:3000/api/account/verify/${verificationToken}`,
  };

  await sendEmail(verifyEmail);
  res.json({
   message: "Verification email sent",
  });
 } catch (error) {
  next(error);
 }
};

module.exports = {
 current,
 signup,
 login,
 logout,
 updateAvatar,
 verifyEmailUser,
 resendVerifyEmail,
};
