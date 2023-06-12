import request, { Response } from 'supertest'
import { app } from '../app'
import { CreateReactionBody } from '../types'

const answer = {
  body: 'My answer',
}
export const createAnswerRequest = async (
  questionId: string,
  tokens: string[] = [],
  modification: Partial<CreateReactionBody> = {},
): Promise<Response> => {
  return await request(app)
    .post(`/api/qna/v1/questions/${questionId}/answers`)
    .set('Cookie', `accessToken=${tokens[0]}`)
    .send({ ...answer, ...modification })
}
