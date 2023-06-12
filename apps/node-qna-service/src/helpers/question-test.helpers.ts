import request, { Response } from 'supertest'
import { app } from '../app'
import { CreateQuestionBody } from '../types'
import { UserRepository, TagRepository } from '../repositories'
import { User, Tag } from '../entities'

const users = [
  {
    id: '6423c07564c35144c5c7f611',
    username: 'user1',
    avatar: { url: 'https://www.google.com', cloudinaryId: 'abc' },
  },
  {
    id: '6423c07f64c35144c5c7f614',
    username: 'user2',
    avatar: { url: 'https://www.google.com', cloudinaryId: 'abc' },
  },
]
export const createUsers = async (): Promise<void> => {
  for (const user of users) {
    const newUser = new User()
    newUser.id = user.id
    newUser.username = user.username
    newUser.avatar = user.avatar

    await UserRepository.save(newUser)
  }
}

const tags = [
  { id: '507f1f77bcf86cd799439011', name: 'javascript' },
  { id: '507f191e810c19729de860ea', name: 'python' },
  { id: '00000020f51bb4362eee2a4d', name: 'web development' },
]
export const createTags = async (): Promise<void> => {
  for (const tag of tags) {
    const newTag = new Tag()
    newTag.id = tag.id
    newTag.name = tag.name

    await TagRepository.save(newTag)
  }
}

export const question = {
  title: 'Question title',
  body: 'question body',
  tagsIds: ['507f1f77bcf86cd799439011'],
  questionViewsCount: 0,
}

export const createQuestionRequest = async (
  tokens: string[] = [],
  modification: Partial<CreateQuestionBody> = {},
): Promise<Response> => {
  return await request(app)
    .post('/api/qna/v1/questions')
    .set('Cookie', `accessToken=${tokens[0]}`)
    .send({ ...question, ...modification })
}

export const getQuestionsRequest = async (query?: string): Promise<Response> => {
  const endpoint = query ? `/api/qna/v1/questions?${query}` : '/api/qna/v1/questions'
  return await request(app).get(endpoint).send()
}

export const getSingleQuestionRequest = async (questionId: string): Promise<Response> => {
  return await request(app).get(`/api/qna/v1/questions/${questionId}`).send()
}

export const updateQuestionViewRequest = async (
  questionId: string,
  tokens: string[] = [],
): Promise<Response> => {
  return await request(app)
    .patch(`/api/qna/v1/questions/${questionId}/questionViews`)
    .set('Cookie', `accessToken=${tokens[0]}`)
    .send()
}

export const deleteQuestionRequest = async (
  questionsId: string,
  tokens: string[] = [],
): Promise<Response> => {
  return await request(app)
    .delete(`/api/qna/v1/questions/${questionsId}`)
    .set('Cookie', `accessToken=${tokens[0]}`)
    .send()
}
