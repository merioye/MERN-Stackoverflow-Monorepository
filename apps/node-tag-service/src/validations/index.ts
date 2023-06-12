import * as Joi from 'joi'

export const createTagValidator = Joi.object({
  name: Joi.string().required(),
})
