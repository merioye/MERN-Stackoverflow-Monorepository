import { Topics } from 'stackoverflow-server-common'
import { createQuestionRequest, question } from '../helpers'
import { producer } from '../kafka'

describe('Create a Question', () => {
  it('returns a 401 when the user is not logged in', async () => {
    const response = await createQuestionRequest()

    expect(response.statusCode).toEqual(401)
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors[0].message).toEqual('Invalid token...')
  })

  it('returns a 400 when invalid title is provided', async () => {
    const tokens = global.login()
    const response = await createQuestionRequest(tokens, { title: '' })

    expect(response.statusCode).toEqual(400)
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors[0].field).toEqual('title')
  })

  it('returns a 400 when invalid body is provided', async () => {
    const tokens = global.login()
    const response = await createQuestionRequest(tokens, { body: '' })

    expect(response.statusCode).toEqual(400)
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors[0].field).toEqual('body')
  })

  it('returns a 400 when empty tagsIds is provided', async () => {
    const tokens = global.login()
    const response = await createQuestionRequest(tokens, { tagsIds: [] })

    expect(response.statusCode).toEqual(400)
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors[0].field).toEqual('tagsIds')
  })

  it('returns a 400 when invalid tagsIds is provided', async () => {
    const tokens = global.login()
    const response = await createQuestionRequest(tokens, { tagsIds: ['5'] })

    expect(response.statusCode).toEqual(400)
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors[0].message).toEqual('All tagsIds must be valid')
  })

  it('returns a 404 when user does not exist with provided id', async () => {
    const tokens = global.login({ userId: '507f1f77bcf86cd799439011' })
    const response = await createQuestionRequest(tokens)

    expect(response.statusCode).toEqual(404)
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors[0].message).toEqual('User does not exist')
  })

  it('returns a 201 on successfull question creation and produces a message to kafka', async () => {
    const tokens = global.login()
    const response = await createQuestionRequest(tokens)

    expect(response.statusCode).toEqual(201)
    expect(response.body.question.id).toBeDefined()
    expect(response.body.question.title).toEqual(question.title)
    expect(response.body.question.body).toEqual(question.body)
    expect(producer.produce).toHaveBeenCalledWith(
      Topics.QuestionCreated,
      expect.objectContaining({ title: question.title }),
    )
  })
})
