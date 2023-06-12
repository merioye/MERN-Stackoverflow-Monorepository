import { createAnswerRequest, createQuestionRequest } from '../helpers'
import { producer } from '../kafka'

describe('Create Answer', () => {
  it('returns a 401 when the user is not logged in', async () => {
    const tokens = global.login()
    const createQuestionResponse = await createQuestionRequest(tokens)
    expect(createQuestionResponse.statusCode).toEqual(201)

    const questionId = createQuestionResponse.body.question.id

    const response = await createAnswerRequest(questionId)
    expect(response.statusCode).toEqual(401)
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors[0].message).toEqual('Invalid token...')
  })

  it('returns a 400 when invalid uuid is provided', async () => {
    const tokens = global.login()
    const createQuestionResponse = await createQuestionRequest(tokens)
    expect(createQuestionResponse.statusCode).toEqual(201)

    const response = await createAnswerRequest('invalid uuid', tokens)
    expect(response.statusCode).toEqual(400)
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors[0].message).toEqual('Please provide a valid questionId')
  })

  it('returns a 400 when answer body is not provided', async () => {
    const tokens = global.login()
    const createQuestionResponse = await createQuestionRequest(tokens)
    expect(createQuestionResponse.statusCode).toEqual(201)

    const questionId = createQuestionResponse.body.question.id

    const response = await createAnswerRequest(questionId, tokens, { body: '' })
    expect(response.statusCode).toEqual(400)
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors[0].field).toEqual('body')
  })

  it('returns a 404 when the question is not found with provided questionId', async () => {
    const tokens = global.login()
    const createQuestionResponse = await createQuestionRequest(tokens)
    expect(createQuestionResponse.statusCode).toEqual(201)

    const response = await createAnswerRequest('7b7a51cf-0876-40d6-aef9-6763a6c74475', tokens)
    expect(response.statusCode).toEqual(404)
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors[0].message).toEqual('Question not found')
  })

  it('returns a 403 when the user is not found', async () => {
    const user1Tokens = global.login()
    const createQuestionResponse = await createQuestionRequest(user1Tokens)
    expect(createQuestionResponse.statusCode).toEqual(201)

    const questionId = createQuestionResponse.body.question.id

    const user2Tokens = global.login({ userId: 'id that does not exist' })

    const response = await createAnswerRequest(questionId, user2Tokens)
    expect(response.statusCode).toEqual(403)
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors[0].message).toEqual('Action Forbidden')
  })

  it('successfully creates the answer and produces a message to kafka', async () => {
    const tokens = global.login()
    const createQuestionResponse = await createQuestionRequest(tokens)
    expect(createQuestionResponse.statusCode).toEqual(201)

    const questionId = createQuestionResponse.body.question.id

    const response = await createAnswerRequest(questionId, tokens)
    expect(response.statusCode).toEqual(201)
    expect(response.body.answer).toBeDefined()
    expect(producer.produce).toHaveBeenCalledTimes(2)
  })
})
