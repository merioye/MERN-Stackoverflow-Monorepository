import { Response } from 'express'
import {} from 'typeorm'
import {
  CustomRequest,
  joiValidationOptions,
  RequestValidationError,
  NotFoundError,
  ForbiddenError,
  BadRequestError,
  validatorService,
  QuestionCreatedData,
  QuestionUpdatedData,
  QuestionDeletedData,
  QuestionCreated,
  Topics,
  QuestionUpdated,
  QuestionDeleted,
} from 'stackoverflow-server-common'
import { questionService, questionViewService, tagService, userService } from '../services'
import { CreateQuestionBody } from '../types'
import { createQuestionValidator } from '../validations'
import { producer } from '../kafka'

class QuestionController {
  createQuestion = async (req: CustomRequest<CreateQuestionBody>, res: Response) => {
    const userId = req.auth?.userId as string
    const { tagsIds } = req.body

    const { error } = createQuestionValidator.validate(req.body, joiValidationOptions)
    if (error) {
      throw new RequestValidationError(error.details)
    }

    const user = await userService.findOnlyBy({ id: userId })
    if (!user) {
      throw new NotFoundError('User does not exist')
    }

    const tags = await tagService.validateAndfindTagsBy(tagsIds)

    const question = await questionService.create(req.body, user, tags)

    const message: QuestionCreatedData = {
      id: question.id,
      title: question.title,
      body: question.body,
      authorId: question.author.id,
      questionViewersIds: [],
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
      version: question.version,
    }
    await producer.produce<QuestionCreated>(Topics.QuestionCreated, message)

    res.status(201).json({
      question,
    })
  }

  getQuestions = async (req: CustomRequest<{}>, res: Response) => {
    const [questions, totalCount] = await questionService.findMultiple(req)
    res.status(200).json({ questions, totalCount })
  }

  getSingleQuestion = async (req: CustomRequest<{}>, res: Response) => {
    const id = req.params.id
    const isValid = validatorService.isValidUUID(id)
    if (!isValid) {
      throw new BadRequestError('Please provide a valid id')
    }

    const question = await questionService.findOnly({ id: id })
    if (!question) {
      throw new NotFoundError('Question not found with provided id')
    }

    res.status(200).json({ question })
  }

  updateQuestionViews = async (req: CustomRequest<{}>, res: Response) => {
    const userId = req.auth?.userId as string
    const id = req.params.id
    const isValid = validatorService.isValidUUID(id)
    if (!isValid) {
      throw new BadRequestError('Please provide a valid id')
    }

    const alreadyViewed = await questionViewService.findOnlyBy({
      question: { id: id },
      viewer: { id: userId },
    })
    if (alreadyViewed) {
      return res
        .status(200)
        .json({ message: 'Question views updated successfully', newAdded: false })
    }

    const question = await questionService.findOnly({ id: id })
    if (!question) {
      throw new NotFoundError('Question not found')
    }
    if (question.author.id === userId) {
      return res
        .status(200)
        .json({ message: 'Question views updated successfully', newAdded: false })
    }

    const user = await userService.findOnlyBy({ id: userId })
    if (!user) {
      throw new ForbiddenError()
    }

    await questionViewService.create(question, user)
    const updatedQuestion = await questionService.incrementQuestionView(question)

    const message: QuestionUpdatedData = {
      id: updatedQuestion.id,
      newViewerId: userId,
      updatedAt: updatedQuestion.updatedAt,
      version: updatedQuestion.version,
    }
    await producer.produce<QuestionUpdated>(Topics.QuestionUpdated, message)

    res.status(200).json({ message: 'Question views updated successfully', newAdded: true })
  }

  deleteQuestion = async (req: CustomRequest<{}>, res: Response) => {
    const userId = req.auth?.userId as string
    const id = req.params.id
    const isValid = validatorService.isValidUUID(id)
    if (!isValid) {
      throw new BadRequestError('Please provide a valid id')
    }

    const question = await questionService.findOnly({ id: id, author: { id: userId } })
    if (!question) {
      throw new ForbiddenError()
    }

    await questionService.removeOnly(question)

    const message: QuestionDeletedData = {
      id,
      version: question.version,
    }
    await producer.produce<QuestionDeleted>(Topics.QuestionDeleted, message)

    res.status(200).json({ message: 'Question deleted successfully' })
  }
}

export const questionController = new QuestionController()
