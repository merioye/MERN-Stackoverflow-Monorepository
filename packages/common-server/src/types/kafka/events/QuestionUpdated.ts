import { Topics } from '../TopicsEnum'
import { QuestionUpdatedData } from '../data'

export interface QuestionUpdated {
  topic: Topics.QuestionUpdated
  data: QuestionUpdatedData
}
