import * as Joi from 'joi'

export const createQuestionValidator = Joi.object({
  title: Joi.string().min(3).max(255).required(),
  body: Joi.string().min(5).required(),
  tagsIds: Joi.array<string>().items(Joi.string()).min(1).max(5).required(),
  questionViewsCount: Joi.number().optional(),
})

export const createReactionValidator = Joi.object({
  body: Joi.string().min(3).required(),
})
