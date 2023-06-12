import request, { Response } from 'supertest'
import { CreateTagBody } from '../types'
import { app } from '../app'

const tag = {
  name: 'tag name',
}
export const createTagRequest = async (
  tokens: string[] = [],
  modification: Partial<CreateTagBody> = {},
): Promise<Response> => {
  return await request(app)
    .post('/api/tag/v1/tags')
    .set('Cookie', `accessToken=${tokens[0]}`)
    .send({ ...tag, ...modification })
}

export const getTagsRequest = async (query?: string): Promise<Response> => {
  const endpoint = query ? `/api/tag/v1/tags?${query}` : '/api/tag/v1/tags'
  return await request(app).get(endpoint).send()
}
