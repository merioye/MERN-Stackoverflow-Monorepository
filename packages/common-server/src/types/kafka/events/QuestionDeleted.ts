import { Topics } from '../TopicsEnum'
import { QuestionDeletedData } from '../data'

export interface QuestionDeleted {
  topic: Topics.QuestionDeleted
  data: QuestionDeletedData
}
