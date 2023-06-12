import request, { Response } from 'supertest'
import { app } from '../app'
import { CreateReactionBody } from '../types'

const comment = {
  body: 'My comment',
}
export const createCommentRequest = async (
  questionId: string,
  tokens: string[] = [],
  modification: Partial<CreateReactionBody> = {},
): Promise<Response> => {
  return await request(app)
    .post(`/api/qna/v1/questions/${questionId}/comments`)
    .set('Cookie', `accessToken=${tokens[0]}`)
    .send({ ...comment, ...modification })
}
