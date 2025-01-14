const Joi = require("joi");

const userRegisterSchema = Joi.object({
 email: Joi.string()
  .email({
   minDomainSegments: 2,
   tlds: { allow: ["com", "net", "org", "ru", "ua"] },
  })
  .pattern(/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i)
  .required(),
 password: Joi.string()
  .pattern(/^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/)
  .required(),
 subscription: Joi.any().valid("starter", "pro", "business").default("starter"),
});

const validator = (schema, { body }, res, next) => {
 const { error } = schema.validate(body);

 if (error) {
  return res.status(400).json({
   status: "Bad Request",
   code: 400,
   message: error.message.replace(/"/g, ""),
  });
 }

 next();
};

const validateRegisterUser = (req, res, next) => validator(userRegisterSchema, req, res, next);

module.exports = {
 validateRegisterUser,
};
