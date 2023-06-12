import { Entity, ManyToOne } from 'typeorm'
import { Question } from './Question'
import { User } from './User'
import { Reaction } from './utils/Reaction'

@Entity('answers')
export class Answer extends Reaction {
  @ManyToOne(() => User, (user) => user.answers, { onDelete: 'CASCADE' })
  author: User

  @ManyToOne(() => Question, (question) => question.answers, { onDelete: 'CASCADE' })
  question: Question
}
