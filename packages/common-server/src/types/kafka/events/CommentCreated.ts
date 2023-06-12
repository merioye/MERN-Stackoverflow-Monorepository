import { ReactionCreatedData } from '../data'
import { Topics } from '../TopicsEnum'

export interface CommentCreated {
  topic: Topics.CommentCreated
  data: ReactionCreatedData
}
