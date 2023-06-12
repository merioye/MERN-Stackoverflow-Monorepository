import mongoose from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'
import {
  QuestionCreatedData,
  QuestionDeletedData,
  QuestionUpdatedData,
} from 'stackoverflow-server-common'

import { UserDoc } from './user.model'
import { answerService, commentService, questionService } from '../services'

// A type representing findByMessage method's
// parameter that it can receive
type Message = QuestionCreatedData | QuestionUpdatedData | QuestionDeletedData

// An interface that describes the properties
// that are required to create a new Question
interface QuestionAttrs {
  _id: string
  title: string
  body: string
  author: string
  questionViews: string[]
  createdAt: Date
  updatedAt: Date
}

// An interface that describes the properties
// that a Question Document has
export interface QuestionDoc extends mongoose.Document {
  title: string
  body: string
  author: string | UserDoc
  questionViews: string[] | UserDoc[]
  createdAt: Date
  updatedAt: Date
  version: number
}

// An interface that describes the properties
// that a Question Model has
interface QuestionModel extends mongoose.Model<QuestionDoc> {
  build(attrs: QuestionAttrs): QuestionDoc // eslint-disable-line
  findByMessage(message: Message): Promise<QuestionDoc | null> // eslint-disable-line
}

const ObjectId = mongoose.Schema.Types.ObjectId

const questionSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    author: { type: ObjectId, ref: 'User', required: true },
    questionViews: [{ type: ObjectId, ref: 'User', unique: true }],
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

questionSchema.set('versionKey', 'version')
questionSchema.plugin(updateIfCurrentPlugin)

// Adding new custom methods to QuestionModel
questionSchema.statics.findByMessage = async (message: Message): Promise<QuestionDoc | null> => {
  const { id, version } = message
  return await questionService.findOnly({ _id: id, version: version - 1 })
}
questionSchema.statics.build = (attrs: QuestionAttrs): QuestionDoc => {
  return new QuestionModel(attrs)
}

questionSchema.pre<QuestionDoc>('findOneAndDelete', async function (next) {
  const questionId = this._id

  await answerService.removeMultiple({ question: questionId })
  await commentService.removeMultiple({ question: questionId })

  next()
})

export const QuestionModel = mongoose.model<QuestionDoc, QuestionModel>('Question', questionSchema)
