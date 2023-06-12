import { Response } from 'express'
import {
  BadRequestError,
  CommentCreated,
  CustomRequest,
  ForbiddenError,
  joiValidationOptions,
  NotFoundError,
  ReactionCreatedData,
  RequestValidationError,
  Topics,
  validatorService,
} from 'stackoverflow-server-common'
import { createReactionValidator } from '../validations'
import { CreateReactionBody } from '../types'
import { commentService, questionService, userService } from '../services'
import { producer } from '../kafka'

class CommentController {
  createComment = async (req: CustomRequest<CreateReactionBody>, res: Response) => {
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

    const comment = await commentService.create(req.body, question, user)

    const message: ReactionCreatedData = {
      id: comment.id,
      body: comment.body,
      authorId: comment.author.id,
      questionId: comment.question.id,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      version: comment.version,
    }
    await producer.produce<CommentCreated>(Topics.CommentCreated, message)

    res.status(201).json({ comment })
  }
}

export const commentController = new CommentController()
