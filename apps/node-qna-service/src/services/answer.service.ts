import { CreateReactionBody } from '../types'
import { AnswerRepository } from '../repositories'
import { Answer, Question, User } from '../entities'
import { cacheKeysService } from '../config/cache'

class AnswerService {
  create = async (
    createAnswerBody: CreateReactionBody,
    question: Question,
    user: User,
  ): Promise<Answer> => {
    const answer = new Answer()
    answer.body = createAnswerBody.body
    answer.question = question
    answer.author = user

    const savedAnswer = await AnswerRepository.save(answer)
    await cacheKeysService.deleteKeys(['questions*', `question_${question.id}*`])

    return savedAnswer
  }
}

export const answerService = new AnswerService()
