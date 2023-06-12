import { getSingleQuestionRequest, createQuestionRequest } from '../helpers'

describe('Get Single Question', () => {
  it('returns a 400 when invalid uuid is provided', async () => {
    const response = await getSingleQuestionRequest('invalid uuid')

    expect(response.statusCode).toEqual(400)
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors[0].message).toEqual('Please provide a valid id')
  })

  it('returns a 404 when the question is not found with provided id', async () => {
    const response = await getSingleQuestionRequest('7b7a51cf-0876-40d6-aef9-6763a6c74475')

    expect(response.statusCode).toEqual(404)
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors[0].message).toEqual('Question not found with provided id')
  })

  it('returns the question associated with the provided id', async () => {
    const tokens = global.login()

    const createQuestionResponse = await createQuestionRequest(tokens)
    const questionId = createQuestionResponse.body.question.id
    expect(createQuestionResponse.statusCode).toEqual(201)

    const response = await getSingleQuestionRequest(questionId)
    expect(response.statusCode).toEqual(200)
    expect(response.body.question.id).toEqual(questionId)
  })
})
