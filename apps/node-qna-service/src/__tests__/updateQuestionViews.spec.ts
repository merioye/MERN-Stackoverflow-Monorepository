import { createQuestionRequest, updateQuestionViewRequest } from '../helpers'
import { producer } from '../kafka'

describe('Update Question Views', () => {
  it('returns a 401 when the user is not logged in', async () => {
    const response = await updateQuestionViewRequest('abc')

    expect(response.statusCode).toEqual(401)
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors[0].message).toEqual('Invalid token...')
  })

  it('returns a 400 when invalid uuid is provided', async () => {
    const tokens = global.login()
    const response = await updateQuestionViewRequest('invalid uuid', tokens)

    expect(response.statusCode).toEqual(400)
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors[0].message).toEqual('Please provide a valid id')
  })

  it('returns a 200 when the question is already viewed by user', async () => {
    const user1Tokens = global.login()
    const createQuestionResponse = await createQuestionRequest(user1Tokens)
    expect(createQuestionResponse.statusCode).toEqual(201)

    const user2Tokens = global.login({ userId: '6423c07f64c35144c5c7f614' })
    const questionId = createQuestionResponse.body.question.id

    const updateQuestionViewResponse1 = await updateQuestionViewRequest(questionId, user2Tokens)
    expect(updateQuestionViewResponse1.statusCode).toEqual(200)
    expect(updateQuestionViewResponse1.body.message).toEqual('Question views updated successfully')
    expect(updateQuestionViewResponse1.body.newAdded).toEqual(true)

    const updateQuestionViewResponse2 = await updateQuestionViewRequest(questionId, user2Tokens)
    expect(updateQuestionViewResponse2.statusCode).toEqual(200)
    expect(updateQuestionViewResponse2.body.message).toEqual('Question views updated successfully')
    expect(updateQuestionViewResponse2.body.newAdded).toEqual(false)
  })

  it('returns a 404 when the question is not found with provided id', async () => {
    const tokens = global.login()
    const createQuestionResponse = await createQuestionRequest(tokens)
    expect(createQuestionResponse.statusCode).toEqual(201)

    const updateQuestionViewResponse = await updateQuestionViewRequest(
      '7b7a51cf-0876-40d6-aef9-6763a6c74475',
      tokens,
    )
    expect(updateQuestionViewResponse.statusCode).toEqual(404)
    expect(updateQuestionViewResponse.body.errors).toHaveLength(1)
    expect(updateQuestionViewResponse.body.errors[0].message).toEqual('Question not found')
  })

  it('returns a 200 when the question is viewed by its author', async () => {
    const tokens = global.login()
    const createQuestionResponse = await createQuestionRequest(tokens)
    expect(createQuestionResponse.statusCode).toEqual(201)

    const questionId = createQuestionResponse.body.question.id

    const updateQuestionViewResponse = await updateQuestionViewRequest(questionId, tokens)
    expect(updateQuestionViewResponse.statusCode).toEqual(200)
    expect(updateQuestionViewResponse.body.message).toEqual('Question views updated successfully')
    expect(updateQuestionViewResponse.body.newAdded).toEqual(false)
  })

  it('returns a 403 when the user is not found', async () => {
    const user1Tokens = global.login()
    const createQuestionResponse = await createQuestionRequest(user1Tokens)
    expect(createQuestionResponse.statusCode).toEqual(201)

    const questionId = createQuestionResponse.body.question.id

    const user2Tokens = global.login({ userId: 'id that does not exist' })

    const updateQuestionViewResponse = await updateQuestionViewRequest(questionId, user2Tokens)
    expect(updateQuestionViewResponse.statusCode).toEqual(403)
    expect(updateQuestionViewResponse.body.errors).toHaveLength(1)
    expect(updateQuestionViewResponse.body.errors[0].message).toEqual('Action Forbidden')
  })

  it('successfully updates the question views and produces a message to kafka', async () => {
    const user1Tokens = global.login()
    const createQuestionResponse = await createQuestionRequest(user1Tokens)
    expect(createQuestionResponse.statusCode).toEqual(201)

    const user2Tokens = global.login({ userId: '6423c07f64c35144c5c7f614' })
    const questionId = createQuestionResponse.body.question.id

    const updateQuestionViewResponse1 = await updateQuestionViewRequest(questionId, user2Tokens)
    expect(updateQuestionViewResponse1.statusCode).toEqual(200)
    expect(updateQuestionViewResponse1.body.message).toEqual('Question views updated successfully')
    expect(updateQuestionViewResponse1.body.newAdded).toEqual(true)
    expect(producer.produce).toHaveBeenCalledTimes(2)
  })
})
