import mongoose from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'
import { ReactionCreatedData } from 'stackoverflow-server-common'

import { QuestionDoc } from './question.model'
import { UserDoc } from './user.model'
import { commentService } from '../services'

// A type representing findByMessage method's
// parameter that it can receive
type Message = ReactionCreatedData

// An interface that describes the properties
// that are required to create a new Comment
interface CommentAttrs {
  _id: string
  body: string
  author: string
  question: string
  createdAt: Date
  updatedAt: Date
}

// An interface that describes the properties
// that a Comment Document has
export interface CommentDoc extends mongoose.Document {
  body: string
  author: string | UserDoc
  question: string | QuestionDoc
  createdAt: Date
  updatedAt: Date
  version: number
}

// An interface that describes the properties
// that a Comment Model has
interface CommentModel extends mongoose.Model<CommentDoc> {
  build(attrs: CommentAttrs): CommentDoc // eslint-disable-line
  findByMessage(message: Message): Promise<CommentDoc | null> // eslint-disable-line
}

const ObjectId = mongoose.Schema.Types.ObjectId

const commentSchema = new mongoose.Schema(
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

commentSchema.set('versionKey', 'version')
commentSchema.plugin(updateIfCurrentPlugin)

// Adding new custom methods to CommentModel
commentSchema.statics.findByMessage = async (message: Message): Promise<CommentDoc | null> => {
  const { id, version } = message
  return await commentService.findOnly({ _id: id, version: version - 1 })
}
commentSchema.statics.build = (attrs: CommentAttrs): CommentDoc => {
  return new CommentModel(attrs)
}

export const CommentModel = mongoose.model<CommentDoc, CommentModel>('Comment', commentSchema)
