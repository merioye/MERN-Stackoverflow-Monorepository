import { Topics } from '../TopicsEnum'
import { UserUpdatedData } from '../data'

export interface UserUpdated {
  topic: Topics.UserUpdated
  data: UserUpdatedData
}
