import { Entity, ManyToOne } from 'typeorm'
import { Question } from './Question'
import { User } from './User'
import { Reaction } from './utils/Reaction'

@Entity('comments')
export class Comment extends Reaction {
  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
  author: User

  @ManyToOne(() => Question, (question) => question.comments, { onDelete: 'CASCADE' })
  question: Question
}
