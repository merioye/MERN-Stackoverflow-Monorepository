import mongoose from 'mongoose'
import { SpeedGooseCacheAutoCleaner } from 'speedgoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

import { AnswerDoc } from './answer.model'
import { CommentDoc } from './comment.model'
import { QuestionDoc } from './question.model'
import { answerService, commentService, questionService } from '../services'

// An interface that describes the properties
// that are requried to create a new User
export interface UserAttrs {
  username: string
  password: string
  avatar: {
    url: string
    cloudinaryId: string
  }
}

// An interface that describes the properties
// that a User Document has
export interface UserDoc extends mongoose.Document {
  username: string
  password: string
  avatar: {
    url: string
    cloudinaryId: string
  }
  profileViews: string[] | UserDoc[]
  questions: string[] | QuestionDoc[]
  answers: string[] | AnswerDoc[]
  comments: string[] | CommentDoc[]
  createdAt: Date
  updatedAt: Date
  version: number
}

// An interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc // eslint-disable-line
}

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minLength: 3,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      url: {
        type: String,
        required: true,
      },
      cloudinaryId: {
        type: String,
        required: true,
      },
    },
    profileViews: [{ type: String, ref: 'User' }],
    questions: [{ type: String, ref: 'Question' }],
    answers: [{ type: String, ref: 'Answer' }],
    comments: [{ type: String, ref: 'Comment' }],
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

userSchema.set('versionKey', 'version')
userSchema.plugin(updateIfCurrentPlugin)
userSchema.plugin(SpeedGooseCacheAutoCleaner)

// Adding new custom method to UserModel
userSchema.statics.build = (attrs: UserAttrs): UserDoc => {
  return new UserModel(attrs)
}

userSchema.pre<UserDoc>('deleteOne', async function (next) {
  const questionsIds = this.questions
  const answersIds = this.answers
  const commentsIds = this.comments

  await questionService.removeMultiple({ _id: { $in: questionsIds } })
  await answerService.removeMultiple({ _id: { $in: answersIds } })
  await commentService.removeMultiple({ _id: { $in: commentsIds } })

  next()
})

export const UserModel = mongoose.model<UserDoc, UserModel>('User', userSchema)
