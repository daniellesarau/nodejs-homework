const passport = require("passport");

module.exports = (req, res, next) => {
 passport.authenticate("jwt", { session: false }, (error, user) => {
  if (error || !user) {
   return res.status(401).json({
    status: "Unauthorized",
    code: 401,
    message: "Unauthorized",
   });
  }
  req.user = user;
  next();
 })(req, res, next);
};
