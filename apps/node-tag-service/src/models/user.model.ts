import mongoose from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'
import { UserCreatedData, UserUpdatedData } from 'stackoverflow-server-common'
import { userService } from '../services'

// A type representing findByMessage method's
// parameter that it can receive
type Message = UserCreatedData | UserUpdatedData

// An interface that describes the properties
// that are required to create a new User
interface UserAttrs {
  _id: string
  username: string
  avatar: {
    url: string
    cloudinaryId: string
  }
  createdAt: Date
  updatedAt: Date
}

// An interface that describes the properties
// that a User Document has
export interface UserDoc extends mongoose.Document {
  username: string
  avatar: {
    url: string
    cloudinaryId: string
  }
  createdAt: Date
  updatedAt: Date
  version: number
}

// An interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc // eslint-disable-line
  findByMessage(message: Message): Promise<UserDoc | null> // eslint-disable-line
}

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
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
  },
  {
    timestamps: true,
    toJSON: {
      transform(_, ret) {
        ret.id = ret._id
        delete ret._id
      },
    },
    toObject: {
      transform(_, ret) {
        ret.id = ret._id
        delete ret._id
      },
    },
  },
)

userSchema.set('versionKey', 'version')
userSchema.plugin(updateIfCurrentPlugin)

// Adding new customs method to UserModel
userSchema.statics.findByMessage = async (message: Message): Promise<UserDoc | null> => {
  const { id, version } = message
  return await userService.findOnly({ _id: id, version: version - 1 })
}
userSchema.statics.build = (attrs: UserAttrs): UserDoc => {
  return new UserModel(attrs)
}

export const UserModel = mongoose.model<UserDoc, UserModel>('User', userSchema)
