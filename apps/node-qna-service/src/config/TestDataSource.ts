import * as dotenv from 'dotenv'

dotenv.config()

import { DataSource } from 'typeorm'
import { User, Question, Answer, Comment, Tag, QuestionView } from '../entities'

export const TestDataSource = new DataSource({
  type: 'postgres',
  url: process.env.POSTGRES_URI_TEST,
  database: process.env.POSTGRES_DATABASE_TEST,
  entities: [User, Question, Answer, Comment, Tag, QuestionView],
  // synchronize: NODE_ENV !== 'production' ? true : false,
  synchronize: true,
  cache: false,
  dropSchema: true,
})
