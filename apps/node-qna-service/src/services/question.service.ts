import { CustomRequest, UrlQuery, PostgresSortOrder } from 'stackoverflow-server-common'
import { ILike, FindOptionsWhere } from 'typeorm'
import { QuestionRepository } from '../repositories'
import { CreateQuestionBody } from '../types'
import { Question, Tag, User } from '../entities'
import { QuestionRecordService } from './questionRecord.service'
import { getEnvVars } from '../config/constants'
import { cacheKeysService } from '../config/cache'

const { REDIS_TTL } = getEnvVars()

class QuestionService {
  create = async (
    createQuestionBody: CreateQuestionBody,
    user: User,
    tags: Tag[],
  ): Promise<Question> => {
    const { title, body } = createQuestionBody

    const question = new Question()
    question.title = title
    question.body = body
    question.tags = tags
    question.author = user

    await QuestionRepository.save(question)
    await cacheKeysService.deleteKeys(['questions*'])

    return question
  }

  findMultiple = async (req: CustomRequest<{}>): Promise<[Question[], number]> => {
    const keyword = req.query.keyword
    const filter = keyword
      ? [{ title: ILike(`%${keyword}%`) }, { tags: { name: ILike(`%${keyword}%`) } }]
      : {}

    const query = req.query as UrlQuery
    const questionRecordService = new QuestionRecordService<PostgresSortOrder>(query)
    const sortBy = questionRecordService.getSortOption()
    const { skip, take } = questionRecordService.buildPagination()

    return await QuestionRepository.findAndCount({
      where: filter,
      skip: skip,
      take: take,
      order: Object.keys(sortBy).length ? sortBy : { createdAt: 'ASC' },
      cache: { id: 'questions', milliseconds: REDIS_TTL },
    })
  }

  findOnly = async (filter: FindOptionsWhere<Question>): Promise<Question | null> => {
    return await QuestionRepository.findOne({
      where: filter,
      relations: {
        answers: { author: true },
        comments: {
          author: true,
        },
      },
      cache: { id: `question_${filter.id}`, milliseconds: REDIS_TTL },
    })
  }

  findOnlyBy = async (filter: FindOptionsWhere<Question>): Promise<Question | null> => {
    return await QuestionRepository.findOneBy(filter)
  }

  incrementQuestionView = async (question: Question): Promise<Question> => {
    question.questionViewsCount++
    const updatedQuestion = await QuestionRepository.save(question)
    await cacheKeysService.deleteKeys(['questions*', `question_${question.id}*`])

    return updatedQuestion
  }

  removeOnly = async (question: Question): Promise<Question> => {
    const questionId = question.id
    const removedQuestion = await QuestionRepository.remove(question)
    await cacheKeysService.deleteKeys(['questions*', `question_${questionId}*`])

    return removedQuestion
  }
}

export const questionService = new QuestionService()
