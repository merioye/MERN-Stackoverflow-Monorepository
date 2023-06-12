import { Topics } from '../TopicsEnum'
import { ReactionCreatedData } from '../data'

export interface AnswerCreated {
  topic: Topics.AnswerCreated
  data: ReactionCreatedData
}
