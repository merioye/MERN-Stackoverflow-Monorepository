import { Topics } from 'stackoverflow-server-common'
import { createTagRequest } from '../helpers'
import { producer } from '../kafka'

describe('Create Tag', () => {
  it('returns a 401 when the user is not logged in', async () => {
    const response = await createTagRequest()
    expect(response.statusCode).toEqual(401)
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors[0].message).toEqual('Invalid token...')
  })

  it('returns a 400 when tag name is not provided', async () => {
    const tokens = global.login()
    const response = await createTagRequest(tokens, { name: '' })
    expect(response.statusCode).toEqual(400)
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors[0].field).toEqual('name')
  })

  it('returns a 200 when tag already exists with provided name', async () => {
    const tokens = global.login()
    const response1 = await createTagRequest(tokens, { name: 'python' })
    expect(response1.statusCode).toEqual(201)

    const response2 = await createTagRequest(tokens, { name: 'python' })
    expect(response2.statusCode).toEqual(200)
    expect(response2.body.message).toEqual('Tag already exists')
  })

  it('returns a 403 when the user does not exist', async () => {
    const tokens = global.login({ userId: '507f1f77bcf86cd799439011' })
    const response = await createTagRequest(tokens)
    expect(response.statusCode).toEqual(403)
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors[0].message).toEqual('Action Forbidden')
  })

  it('successfully creates the tag and produces a message to kafka', async () => {
    const tokens = global.login()
    const response = await createTagRequest(tokens)
    expect(response.statusCode).toEqual(201)
    expect(response.body.tag.name).toEqual('tag name')
    expect(producer.produce).toHaveBeenCalledWith(
      Topics.TagCreated,
      expect.objectContaining({ name: 'tag name' }),
    )
  })
})
