import { DataSource } from 'typeorm'
import { User, Question, Answer, Comment, Tag, QuestionView } from '../entities'
import { getEnvVars } from './constants'

const { POSTGRES_URI, POSTGRES_DATABASE, REDIS_URI, REDIS_TTL } = getEnvVars()

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: POSTGRES_URI,
  database: POSTGRES_DATABASE,
  entities: [User, Question, Answer, Comment, Tag, QuestionView],
  // synchronize: NODE_ENV !== 'production' ? true : false,
  synchronize: true,
  cache: {
    type: 'redis',
    duration: REDIS_TTL,
    options: {
      url: REDIS_URI,
    },
  },
})
