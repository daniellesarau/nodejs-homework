const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");

const userSchema = Schema(
 {
  email: {
   type: String,
   required: [true, "email is required"],
   unique: true,
  },
  password: {
   type: String,
   required: [true, "password is required"],
   minlength: 6,
  },
  subscription: {
   type: String,
   enum: ["starter", "pro", "business"],
   default: "starter",
  },
  token: {
   type: String,
   default: null,
  },
  avatarUrl: {
   type: String,
   default: "",
  },
  verify: {
   type: Boolean,
   default: false,
  },
  verificationToken: {
   type: String,
   required: [true, "Verify token is required"],
  },
 },

 { versionKey: false }
);

userSchema.methods.hashPassword = function (password) {
 this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

userSchema.methods.comparePassword = function (password) {
 return bcrypt.compareSync(password, this.password);
};
userSchema.pre("save", function (next) {
 if (!this.avatarUrl) {
  this.avatarUrl = gravatar.url(
   this.email,
   {
    protocol: "https",
    size: "250",
    default: "retro",
   },
   true
  );
 }
 next();
});

module.exports = model("user", userSchema);
