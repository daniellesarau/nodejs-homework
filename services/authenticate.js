const User = require("./schemas/userSchema");
const sgMail = require("@sendgrid/mail");
const { nanoid } = require("nanoid");

const sendEmail = async (emailData) => {
 try {
  await sgMail.send(emailData);
 } catch (error) {
  throw new Error("Error sending email");
 }
};

const register = ({ email, password }) => {
 const verificationToken = nanoid();

 const newUser = new User({ email, password, verificationToken: verificationToken });

 const msg = {
  to: email,
  from: "saraudaniela@gmail.com",
  subject: "Confirmation of registration",
  text: `Your verification code is ${verificationToken} / http://localhost:3000/api/account/verify/${verificationToken}`,
 };

 sendEmail(msg)
  .then(() => console.log("Email sent"))
  .catch((error) => {
   console.error("Error sending email::", error);
   throw new Error("Error sending");
  });

 newUser.hashPassword(password);
 return newUser.save();
};

const getUser = async ({ email }) => {
 return User.findOne({ email }).select("+password +subscription");
};

const getUserById = (userId) => User.findById(userId);

const updateUser = (userId, body) => User.findByIdAndUpdate(userId, body, { new: true });

const verifyEmail = async (verificationToken) => {
 const update = { verify: true, verificationToken: null };
 const result = await User.findOneAndUpdate(
  {
   verificationToken,
  },
  { $set: update },
  { new: true }
 );
 if (!result) throw new Error("User not found");
};

module.exports = {
 getUser,
 getUserById,
 updateUser,
 register,
 verifyEmail,
 sendEmail,
};
