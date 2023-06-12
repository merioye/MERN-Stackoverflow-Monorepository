import { Topics } from '../TopicsEnum'
import { TagCreatedData } from '../data'

export interface TagCreated {
  topic: Topics.TagCreated
  data: TagCreatedData
}
