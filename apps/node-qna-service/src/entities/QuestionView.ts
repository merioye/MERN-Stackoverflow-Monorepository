import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm'
import { Question } from './Question'
import { User } from './User'

@Entity('questions_views')
export class QuestionView {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => Question, (question) => question.questionViews, { onDelete: 'CASCADE' })
  question: Question

  @ManyToOne(() => User, (user) => user.questionViews, { onDelete: 'CASCADE' })
  viewer: User

  @CreateDateColumn()
  viewedAt: Date
}
