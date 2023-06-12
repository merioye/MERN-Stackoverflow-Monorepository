import { Topics } from '../TopicsEnum'
import { UserCreatedData } from '../data'

export interface UserCreated {
  topic: Topics.UserCreated
  data: UserCreatedData
}
