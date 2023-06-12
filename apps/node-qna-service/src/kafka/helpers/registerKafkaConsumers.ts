import { Topics } from 'stackoverflow-server-common'
import { handleTagCreated, handleUserCreated, handleUserUpdated } from '../consumerMessageHandlers'
import { consumer } from '../components'

const topics = [Topics.UserCreated, Topics.UserUpdated, Topics.TagCreated]
const topicsHandlersMap = {
  [Topics.UserCreated]: handleUserCreated,
  [Topics.UserUpdated]: handleUserUpdated,
  [Topics.TagCreated]: handleTagCreated,
}

export const registerKafkaConsumers = async (): Promise<void> => {
  await consumer.consume(topics, topicsHandlersMap)
}
