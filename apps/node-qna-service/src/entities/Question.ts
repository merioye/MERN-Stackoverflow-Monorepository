import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
  BeforeUpdate,
} from 'typeorm'
import { Answer } from './Answer'
import { Comment } from './Comment'
import { QuestionView } from './QuestionView'
import { Tag } from './Tag'
import { User } from './User'

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  title: string

  @Column('text')
  body: string

  @ManyToMany(() => Tag, (tag) => tag.questions, { eager: true })
  @JoinTable({ name: 'questions_tags' })
  tags: Tag[]

  @ManyToOne(() => User, (user) => user.questions, { eager: true, onDelete: 'CASCADE' })
  author: User

  @OneToMany(() => Comment, (comment) => comment.question)
  comments: Comment[]

  @OneToMany(() => Answer, (answer) => answer.question)
  answers: Answer[]

  @OneToMany(() => QuestionView, (questionView) => questionView.question)
  questionViews: QuestionView[]

  @Column({ default: 0 })
  questionViewsCount: number

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
