import Joi from "@hapi/joi";

export const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().min(1).max(60).required(),
    surname: Joi.string().min(1).max(60).required(),
    password: Joi.string().min(6).max(60).required(),
});
