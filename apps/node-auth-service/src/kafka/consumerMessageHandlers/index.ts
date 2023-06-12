import {
  ForbiddenError,
  InternalServerError,
  NotFoundError,
  QuestionCreatedData,
  QuestionDeletedData,
  QuestionUpdatedData,
  ReactionCreatedData,
  Topics,
  UserUpdated,
  UserUpdatedData,
} from 'stackoverflow-server-common'
import { answerService, commentService, questionService, userService } from '../../services'
import { producer } from '../components/producer'

// ############################ Answer created handler #######################

export const handleAnswerCreated = async (data: ReactionCreatedData): Promise<void> => {
  const { id, authorId, questionId } = data

  const alreadyExists = await answerService.findOnly({ _id: id })
  if (alreadyExists) {
    throw new ForbiddenError()
  }

  const user = await userService.findOnly({ _id: authorId })
  if (!user) {
    throw new NotFoundError('User not found')
  }

  const question = await questionService.findOnly({ _id: questionId })
  if (!question) {
    throw new NotFoundError('Question not found')
  }

  const answer = await answerService.create(data)
  const updatedUser = await userService.updateSingle(
    { _id: authorId },
    { $addToSet: { answers: answer.id } },
  )

  const message: UserUpdatedData = {
    id: updatedUser?.id,
    updatedAt: updatedUser!.updatedAt,
    version: updatedUser!.version,
  }
  await producer.produce<UserUpdated>(Topics.UserUpdated, message)
}

// ############################ Comment created handler #######################

export const handleCommentCreated = async (data: ReactionCreatedData): Promise<void> => {
  const { id, authorId, questionId } = data

  const alreadyExists = await commentService.findOnly({ _id: id })
  if (alreadyExists) {
    throw new ForbiddenError()
  }

  const user = await userService.findOnly({ _id: authorId })
  if (!user) {
    throw new NotFoundError('User not found')
  }

  const question = await questionService.findOnly({ _id: questionId })
  if (!question) {
    throw new NotFoundError('Question not found')
  }

  const comment = await commentService.create(data)
  const updatedUser = await userService.updateSingle(
    { _id: authorId },
    { $addToSet: { comments: comment.id } },
  )

  const message: UserUpdatedData = {
    id: updatedUser?.id,
    updatedAt: updatedUser!.updatedAt,
    version: updatedUser!.version,
  }
  await producer.produce<UserUpdated>(Topics.UserUpdated, message)
}

// ############################ Question created handler #######################

export const handleQuestionCreated = async (data: QuestionCreatedData): Promise<void> => {
  const { id, authorId, questionViewersIds } = data

  const alreadyExists = await questionService.findOnly({ _id: id })
  if (alreadyExists) {
    throw new ForbiddenError()
  }

  const usersIds = [authorId, ...questionViewersIds]
  for (const userId of usersIds) {
    const user = await userService.findOnly({ _id: userId })
    if (!user) {
      throw new NotFoundError('User not found')
    }
  }

  const question = await questionService.create(data)
  const updatedUser = await userService.updateSingle(
    { _id: authorId },
    { $addToSet: { questions: question.id } },
  )

  const message: UserUpdatedData = {
    id: updatedUser?.id,
    updatedAt: updatedUser!.updatedAt,
    version: updatedUser!.version,
  }
  await producer.produce<UserUpdated>(Topics.UserUpdated, message)
}

// ############################ Question updated handler #######################

export const handleQuestionUpdated = async (data: QuestionUpdatedData): Promise<void> => {
  const { newViewerId, updatedAt } = data

  const question = await questionService.findOnlyByMessage(data)
  if (!question) {
    throw new NotFoundError('Question not found')
  }

  question.set({ updatedAt })
  // eslint-disable-next-line
  // @ts-ignore
  question.questionViews.push(newViewerId)
  await question.save()
}

// ############################ Question deleted handler #######################

export const handleQuestionDeleted = async (data: QuestionDeletedData): Promise<void> => {
  const { id, version } = data

  const deletedQuestion = await questionService.removeOnly({ _id: id, version })
  if (!deletedQuestion) {
    throw new InternalServerError()
  }
  const updatedUser = await userService.updateSingle(
    { _id: deletedQuestion.author },
    { $pull: { questions: deletedQuestion.id } },
  )

  const message: UserUpdatedData = {
    id: updatedUser?.id,
    updatedAt: updatedUser!.updatedAt,
    version: updatedUser!.version,
  }
  await producer.produce<UserUpdated>(Topics.UserUpdated, message)
}
