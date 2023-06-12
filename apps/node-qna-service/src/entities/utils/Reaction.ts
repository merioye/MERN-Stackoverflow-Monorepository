import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeUpdate,
} from 'typeorm'

export abstract class Reaction {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('text')
  body: string

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
