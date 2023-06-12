import { QuestionCreatedData } from '../data'
import { Topics } from '../TopicsEnum'

export interface QuestionCreated {
  topic: Topics.QuestionCreated
  data: QuestionCreatedData
}
