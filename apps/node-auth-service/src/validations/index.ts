import * as Joi from 'joi'

export const registerValidator = Joi.object({
  username: Joi.string().alphanum().min(3).required().label('Username'),
  password: Joi.string().min(8).max(15).required().label('Password'),
  avatar: Joi.object({
    url: Joi.string().uri().required().label('avatar > url'),
    cloudinaryId: Joi.string().required().label('avatar > cloudinaryId'),
  }).required(),
})

export const loginValidator = Joi.object({
  username: Joi.string().required().label('Username'),
  password: Joi.string().required().label('Password'),
})
