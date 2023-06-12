import { createQuestionRequest, deleteQuestionRequest } from '../helpers'
import { producer } from '../kafka'

describe('Delete Question', () => {
  it('returns a 401 when the user is not logged in', async () => {
    const response = await deleteQuestionRequest('abc')

    expect(response.statusCode).toEqual(401)
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors[0].message).toEqual('Invalid token...')
  })

  it('returns a 400 when invalid uuid is provided', async () => {
    const tokens = global.login()
    const response = await deleteQuestionRequest('invalid uuid', tokens)

    expect(response.statusCode).toEqual(400)
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors[0].message).toEqual('Please provide a valid id')
  })

  it('returns a 403 when the user deleting the question is not the author of the question', async () => {
    const user1Tokens = global.login()
    const createQuestionResponse = await createQuestionRequest(user1Tokens)
    expect(createQuestionResponse.statusCode).toEqual(201)

    const user2Tokens = global.login({ userId: '6423c07f64c35144c5c7f614' })
    const questionId = createQuestionResponse.body.question.id

    const response = await deleteQuestionRequest(questionId, user2Tokens)
    expect(response.statusCode).toEqual(403)
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors[0].message).toEqual('Action Forbidden')
  })

  it('successfully deletes the question and produces a message to kafka', async () => {
    const tokens = global.login()
    const createQuestionResponse = await createQuestionRequest(tokens)
    expect(createQuestionResponse.statusCode).toEqual(201)

    const questionId = createQuestionResponse.body.question.id

    const response = await deleteQuestionRequest(questionId, tokens)
    expect(response.statusCode).toEqual(200)
    expect(response.body.message).toEqual('Question deleted successfully')
    expect(producer.produce).toHaveBeenCalledTimes(2)
  })
})
