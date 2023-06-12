import { CreateReactionBody } from '../types'
import { CommentRepository } from '../repositories'
import { Comment, Question, User } from '../entities'
import { cacheKeysService } from '../config/cache'

class CommentService {
  create = async (
    createCommentBody: CreateReactionBody,
    question: Question,
    user: User,
  ): Promise<Comment> => {
    const comment = new Comment()
    comment.body = createCommentBody.body
    comment.question = question
    comment.author = user

    const savedComment = await CommentRepository.save(comment)
    await cacheKeysService.deleteKeys(['questions*', `question_${question.id}*`])

    return savedComment
  }
}

export const commentService = new CommentService()
