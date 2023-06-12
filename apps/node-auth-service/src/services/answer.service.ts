import { ReactionCreatedData } from 'stackoverflow-server-common'
import { AnswerDoc, AnswerModel } from '../models'

class AnswerService {
  findOnly = async (filter: Partial<Record<keyof AnswerDoc, any>>): Promise<AnswerDoc | null> => {
    return await AnswerModel.findOne(filter)
  }

  create = async (data: ReactionCreatedData): Promise<AnswerDoc> => {
    const { id, body, authorId, questionId, createdAt, updatedAt } = data
    const answer = AnswerModel.build({
      _id: id,
      author: authorId,
      question: questionId,
      body,
      createdAt,
      updatedAt,
    })
    await answer.save()

    return answer
  }

  removeMultiple = async (filter: Partial<Record<keyof AnswerDoc, any>> = {}): Promise<void> => {
    await AnswerModel.deleteMany(filter)
  }
}

export const answerService = new AnswerService()
