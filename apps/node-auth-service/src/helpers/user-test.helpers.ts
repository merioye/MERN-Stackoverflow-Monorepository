import request, { Response } from 'supertest'
import { app } from '../app'

export const whoAmIRequest = async (cookies: string[]): Promise<Response> => {
  return await request(app).get('/api/auth/v1/whoAmI').set('Cookie', cookies).send()
}

export const getSingleUserRequest = async (userId: string): Promise<Response> => {
  return await request(app).get(`/api/auth/v1/users/${userId}`).send()
}

export const getUsersRequest = async (query?: string): Promise<Response> => {
  const endpoint = query ? `/api/auth/v1/users?${query}` : '/api/auth/v1/users'
  return await request(app).get(endpoint).send()
}

export const updateProfileViewsRequest = async (
  profileId: string,
  cookies: string[] = [],
): Promise<Response> => {
  return await request(app)
    .patch(`/api/auth/v1/users/${profileId}/profileViews`)
    .set('Cookie', cookies)
    .send()
}
