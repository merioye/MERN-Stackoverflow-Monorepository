import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToMany,
  BeforeUpdate,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Question } from './Question'

@Entity('tags')
export class Tag {
  @PrimaryColumn()
  id: string

  @Column({ unique: true })
  name: string

  @ManyToMany(() => Question, (question) => question.tags)
  questions: Question[]

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
