import mongoose from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'
import { ReactionCreatedData } from 'stackoverflow-server-common'

import { QuestionDoc } from './question.model'
import { UserDoc } from './user.model'
import { answerService } from '../services'

// A type representing findByMessage method's
// parameter that it can receive
type Message = ReactionCreatedData

// An interface that describes the properties
// that are required to create a new Answer
interface AnswerAttrs {
  _id: string
  body: string
  author: string
  question: string
  createdAt: Date
  updatedAt: Date
}

// An interface that describes the properties
// that a Answer Document has
export interface AnswerDoc extends mongoose.Document {
  body: string
  author: string | UserDoc
  question: string | QuestionDoc
  createdAt: Date
  updatedAt: Date
  version: number
}

// An interface that describes the properties
// that a Answer Model has
interface AnswerModel extends mongoose.Model<AnswerDoc> {
  build(attrs: AnswerAttrs): AnswerDoc // eslint-disable-line
  findByMessage(message: Message): Promise<AnswerDoc | null> // eslint-disable-line
}

const ObjectId = mongoose.Schema.Types.ObjectId

const answerSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    author: { type: ObjectId, ref: 'User', required: true },
    question: { type: String, ref: 'Question', required: true },
  },
  {
    timestamps: true,
    toObject: {
      transform(_, ret) {
        ret.id = ret._id
        delete ret._id
      },
    },
    toJSON: {
      transform(_, ret) {
        ret.id = ret._id
        delete ret._id
      },
    },
  },
)

answerSchema.set('versionKey', 'version')
answerSchema.plugin(updateIfCurrentPlugin)

// Adding new custom methods to Answer model
answerSchema.statics.findByMessage = async (message: Message): Promise<AnswerDoc | null> => {
  const { id, version } = message
  return await answerService.findOnly({ _id: id, version: version - 1 })
}
answerSchema.statics.build = (attrs: AnswerAttrs): AnswerDoc => {
  return new AnswerModel(attrs)
}

export const AnswerModel = mongoose.model<AnswerDoc, AnswerModel>('Answer', answerSchema)
