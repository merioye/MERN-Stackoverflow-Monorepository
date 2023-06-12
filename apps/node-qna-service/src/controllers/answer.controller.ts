import { Response } from 'express'
import {
  AnswerCreated,
  BadRequestError,
  CustomRequest,
  ForbiddenError,
  joiValidationOptions,
  NotFoundError,
  ReactionCreatedData,
  RequestValidationError,
  Topics,
  validatorService,
} from 'stackoverflow-server-common'
import { answerService, questionService, userService } from '../services'
import { createReactionValidator } from '../validations'
import { CreateReactionBody } from '../types'
import { producer } from '../kafka'

class AnswerController {
  createAnswer = async (req: CustomRequest<CreateReactionBody>, res: Response) => {
    const userId = req.auth?.userId as string
    const questionId = req.params.id

    const isValid = validatorService.isValidUUID(questionId)
    if (!isValid) {
      throw new BadRequestError('Please provide a valid questionId')
    }

    const { error } = createReactionValidator.validate(req.body, joiValidationOptions)
    if (error) {
      throw new RequestValidationError(error.details)
    }

    const question = await questionService.findOnly({ id: questionId })
    if (!question) {
      throw new NotFoundError('Question not found')
    }

    const user = await userService.findOnly({ id: userId })
    if (!user) {
      throw new ForbiddenError()
    }

    const answer = await answerService.create(req.body, question, user)

    const message: ReactionCreatedData = {
      id: answer.id,
      body: answer.body,
      authorId: answer.author.id,
      questionId: answer.question.id,
      createdAt: answer.createdAt,
      updatedAt: answer.updatedAt,
      version: answer.version,
    }
    await producer.produce<AnswerCreated>(Topics.AnswerCreated, message)

    res.status(201).json({ answer })
  }
}

export const answerController = new AnswerController()
