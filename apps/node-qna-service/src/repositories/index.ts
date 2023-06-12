import { DataSource } from 'typeorm'
import { TagCreatedData, UserCreatedData, UserUpdatedData } from 'stackoverflow-server-common'
import { Answer, Comment, Question, QuestionView, Tag, User } from '../entities'
import { AppDataSource } from '../config/AppDataSource'
import { TestDataSource } from '../config/TestDataSource'
import { getEnvVars } from '../config/constants'

type UserMessage = UserCreatedData | UserUpdatedData
type TagMessage = TagCreatedData

const { NODE_ENV } = getEnvVars()

let dataSource: DataSource

if (NODE_ENV === 'test') {
  dataSource = TestDataSource
} else {
  dataSource = AppDataSource
}

export const QuestionRepository = dataSource.getRepository(Question)
export const AnswerRepository = dataSource.getRepository(Answer)
export const CommentRepository = dataSource.getRepository(Comment)
export const QuestionViewsRepository = dataSource.getRepository(QuestionView)

export const UserRepository = dataSource.getRepository(User).extend({
  async findByMessage(message: UserMessage): Promise<User | null> {
    const { id, version } = message
    return await this.findOneBy({ id, version: version - 1 })
  },
})

export const TagRepository = dataSource.getRepository(Tag).extend({
  async findByMessage(message: TagMessage): Promise<Tag | null> {
    const { id, version } = message
    return await this.findOneBy({ id, version: version - 1 })
  },
})
