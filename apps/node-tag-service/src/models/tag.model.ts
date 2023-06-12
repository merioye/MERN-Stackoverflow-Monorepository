import mongoose from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'
import { SpeedGooseCacheAutoCleaner } from 'speedgoose'

// An interface that describes the properties
// that are requried to create a new Tag
interface TagAttrs {
  name: string
}

// An interface that describes the properties
// that a Tag Document has
export interface TagDoc extends mongoose.Document {
  name: string
  createdAt: Date
  updatedAt: Date
  version: number
}

// An interface that describes the properties
// that a Tag Model has
interface TagModel extends mongoose.Model<TagDoc> {
  build(attrs: TagAttrs): TagDoc // eslint-disable-line
}

const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
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

tagSchema.set('versionKey', 'version')
tagSchema.plugin(updateIfCurrentPlugin)
tagSchema.plugin(SpeedGooseCacheAutoCleaner)

// Adding new custom method to TagModel
tagSchema.statics.build = (attrs: TagAttrs): TagDoc => {
  return new TagModel(attrs)
}

export const TagModel = mongoose.model<TagDoc, TagModel>('Tag', tagSchema)
