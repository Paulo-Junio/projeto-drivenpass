import Joi from "joi";

export const credentialSchema = Joi.object({
  title: Joi.string().required(),
  url: Joi.string().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
  userId: Joi.number().required().min(1)
});
 