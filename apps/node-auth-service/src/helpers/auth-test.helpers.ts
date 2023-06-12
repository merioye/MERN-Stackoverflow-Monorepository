import request, { Response } from 'supertest'
import { app } from '../app'
import { RegisterBody, LoginBody } from '../types'

export const user = {
  username: 'abc',
  password: '12345678',
  avatar: {
    url: 'https://www.google.com',
    cloudinaryId: 'abc',
  },
}

export const registerRequest = async (modification: Partial<RegisterBody>): Promise<Response> => {
  return await request(app)
    .post('/api/auth/v1/register')
    .send({ ...user, ...modification })
}

const loginCredentials = {
  username: 'abc',
  password: '12345678',
}

export const loginRequest = async (modification: Partial<LoginBody>): Promise<Response> => {
  return await request(app)
    .post('/api/auth/v1/login')
    .send({ ...loginCredentials, ...modification })
}

export const logoutRequest = async (cookies: string[]): Promise<Response> => {
  return await request(app).post('/api/auth/v1/logout').set('Cookie', cookies).send()
}

export const refreshRequest = async (refreshToken?: string): Promise<Response> => {
  const cookies = refreshToken ? [refreshToken] : []
  return await request(app).get('/api/auth/v1/refreshToken').set('Cookie', cookies).send()
}
