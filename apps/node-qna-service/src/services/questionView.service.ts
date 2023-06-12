import { FindOptionsWhere } from 'typeorm'
import { Question, QuestionView, User } from '../entities'
import { QuestionViewsRepository } from '../repositories'

class QuestionViewService {
  create = async (question: Question, viewer: User): Promise<QuestionView> => {
    const questionView = new QuestionView()
    questionView.question = question
    questionView.viewer = viewer

    return await QuestionViewsRepository.save(questionView)
  }

  findOnlyBy = async (filter: FindOptionsWhere<QuestionView>): Promise<QuestionView | null> => {
    return await QuestionViewsRepository.findOneBy(filter)
  }
}

export const questionViewService = new QuestionViewService()
