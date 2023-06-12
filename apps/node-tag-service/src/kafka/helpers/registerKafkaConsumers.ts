import { Topics } from 'stackoverflow-server-common'
import { handleUserCreated, handleUserUpdated } from '../consumerMessageHandlers'
import { consumer } from '../components'

const topics = [Topics.UserCreated, Topics.UserUpdated]
const topicsHandlersMap = {
  [Topics.UserCreated]: handleUserCreated,
  [Topics.UserUpdated]: handleUserUpdated,
}

export const registerKafkaConsumers = async (): Promise<void> => {
  await consumer.consume(topics, topicsHandlersMap)
}
