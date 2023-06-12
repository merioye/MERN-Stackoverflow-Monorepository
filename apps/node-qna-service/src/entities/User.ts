import {
  Entity,
  Column,
  PrimaryColumn,
  OneToMany,
  BeforeUpdate,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Answer } from './Answer'
import { Comment } from './Comment'
import { Question } from './Question'
import { QuestionView } from './QuestionView'

@Entity('users')
export class User {
  @PrimaryColumn()
  id: string

  @Column({ unique: true })
  username: string

  @Column('json')
  avatar: {
    url: string
    cloudinaryId: string
  }

  @OneToMany(() => Question, (question) => question.author, { onDelete: 'CASCADE' })
  questions: Question[]

  @OneToMany(() => Answer, (answer) => answer.author, { onDelete: 'CASCADE' })
  answers: Answer[]

  @OneToMany(() => Comment, (comment) => comment.author, { onDelete: 'CASCADE' })
  comments: Comment[]

  @OneToMany(() => QuestionView, (questionView) => questionView.viewer)
  questionViews: QuestionView[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @Column({ default: 0 })
  version: number

  @BeforeUpdate()
  updateVersion() {
    this.version += 1
  }
}
