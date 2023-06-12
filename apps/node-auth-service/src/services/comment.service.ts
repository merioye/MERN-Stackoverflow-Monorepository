import { ReactionCreatedData } from 'stackoverflow-server-common'
import { CommentDoc, CommentModel } from '../models'

class CommentService {
  findOnly = async (filter: Partial<Record<keyof CommentDoc, any>>): Promise<CommentDoc | null> => {
    return await CommentModel.findOne(filter)
  }

  create = async (data: ReactionCreatedData): Promise<CommentDoc> => {
    const { id, body, authorId, questionId, createdAt, updatedAt } = data
    const comment = CommentModel.build({
      _id: id,
      author: authorId,
      question: questionId,
      body,
      createdAt,
      updatedAt,
    })
    await comment.save()

    return comment
  }

  removeMultiple = async (filter: Partial<Record<keyof CommentDoc, any>> = {}): Promise<void> => {
    await CommentModel.deleteMany(filter)
  }
}

export const commentService = new CommentService()
