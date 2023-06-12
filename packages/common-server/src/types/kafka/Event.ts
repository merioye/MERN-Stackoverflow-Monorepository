import { Topics } from './TopicsEnum'

export interface Event {
  topic: Topics
  data: any
}
