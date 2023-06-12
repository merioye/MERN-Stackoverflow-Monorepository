import { QuestionCreatedData, QuestionUpdatedData } from 'stackoverflow-server-common'
import { QuestionDoc, QuestionModel } from '../models'

class QuestionService {
  findOnly = async (
    filter: Partial<Record<keyof QuestionDoc, any>>,
  ): Promise<QuestionDoc | null> => {
    return await QuestionModel.findOne(filter)
  }

  findOnlyByMessage = async (message: QuestionUpdatedData): Promise<QuestionDoc | null> => {
    return await QuestionModel.findByMessage(message)
  }

  create = async (data: QuestionCreatedData): Promise<QuestionDoc> => {
    const { id, authorId, questionViewersIds, body, title, createdAt, updatedAt } = data
    const question = QuestionModel.build({
      _id: id,
      author: authorId,
      questionViews: questionViewersIds,
      title,
      body,
      createdAt,
      updatedAt,
    })
    await question.save()

    return question
  }

  removeOnly = async (
    filter: Partial<Record<keyof QuestionDoc, any>>,
  ): Promise<QuestionDoc | null> => {
    const deletedQuestion = await QuestionModel.findOneAndDelete(filter)
    return deletedQuestion
  }

  removeMultiple = async (filter: Partial<Record<keyof QuestionDoc, any>> = {}): Promise<void> => {
    await QuestionModel.deleteMany(filter)
  }
}

export const questionService = new QuestionService()
