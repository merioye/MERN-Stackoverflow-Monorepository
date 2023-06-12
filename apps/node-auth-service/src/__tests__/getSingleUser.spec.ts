import mongoose from 'mongoose'
import { UserModel } from '../models'
import { getSingleUserRequest } from '../helpers'

describe('Get User by Id', () => {
  it('returns a 400 when invalid objectid is provided', async () => {
    const response = await getSingleUserRequest('invalid objectid')

    expect(response.statusCode).toEqual(400)
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors[0].message).toEqual('Please provide a valid id')
  })

  it('returns a 404 when invalid userId is provided', async () => {
    const id = new mongoose.Types.ObjectId()
    const response = await getSingleUserRequest(String(id))

    expect(response.statusCode).toEqual(404)
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors[0].message).toEqual('User not found with provided id')
  })

  it('responds with user data related to provided userId', async () => {
    await global.login()

    const user = await UserModel.findOne({ username: 'abc' })
    const response = await getSingleUserRequest(user?.id)

    expect(response.statusCode).toEqual(200)
    expect(response.body.user.username).toEqual(user?.username)
  })
})
