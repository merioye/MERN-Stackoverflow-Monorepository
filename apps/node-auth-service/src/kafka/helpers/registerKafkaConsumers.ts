import { Topics } from 'stackoverflow-server-common'
import { consumer } from '../components'
import {
  handleAnswerCreated,
  handleCommentCreated,
  handleQuestionCreated,
  handleQuestionDeleted,
  handleQuestionUpdated,
} from '../consumerMessageHandlers'

const topics = [
  Topics.QuestionCreated,
  Topics.QuestionUpdated,
  Topics.QuestionDeleted,
  Topics.AnswerCreated,
  Topics.CommentCreated,
]
const topicsHandlersMap = {
  [Topics.QuestionCreated]: handleQuestionCreated,
  [Topics.QuestionUpdated]: handleQuestionUpdated,
  [Topics.QuestionDeleted]: handleQuestionDeleted,
  [Topics.CommentCreated]: handleCommentCreated,
  [Topics.AnswerCreated]: handleAnswerCreated,
}

export const registerKafkaConsumers = async (): Promise<void> => {
  await consumer.consume(topics, topicsHandlersMap)
}
