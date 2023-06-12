import mongoose from 'mongoose'

// An interface that describes the properties
// that are requried to create a new Refresh Token
interface RefreshTokenAttrs {
  userId: string
  token: string
}

// An interface that describes the properties
// that a Refresh Token Document has
export interface RefreshTokenDoc extends mongoose.Document {
  userId: string
  token: string
}

// An interface that describes the properties
// that a Refresh Token Model has
interface RefreshTokenModel extends mongoose.Model<RefreshTokenDoc> {
  build(attrs: RefreshTokenAttrs): RefreshTokenDoc // eslint-disable-line
}

const refreshTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
    },
    token: {
      type: String,
      required: true,
    },
  },
  {
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

// Adding new custom method to RefreshTokenModel
refreshTokenSchema.statics.build = (attrs: RefreshTokenAttrs): RefreshTokenDoc => {
  return new RefreshTokenModel(attrs)
}

export const RefreshTokenModel = mongoose.model<RefreshTokenDoc, RefreshTokenModel>(
  'RefreshToken',
  refreshTokenSchema,
)
