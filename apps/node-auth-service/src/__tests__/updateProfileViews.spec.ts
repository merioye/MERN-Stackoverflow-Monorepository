import { registerRequest, loginRequest, updateProfileViewsRequest } from '../helpers'
import { producer } from '../kafka'
import { UserModel } from '../models'

describe('Update Profile Views', () => {
  it('returns a 401 when the user is not logged in', async () => {
    const response = await updateProfileViewsRequest('profile id')

    expect(response.statusCode).toEqual(401)
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors[0].message).toEqual('Invalid token...')
  })

  it('returns a 400 when invalid objectid is provided', async () => {
    const registerResponse = await registerRequest({})
    expect(registerResponse.statusCode).toEqual(201)

    const loginResponse = await loginRequest({})
    expect(loginResponse.statusCode).toEqual(200)

    const cookies = loginResponse.get('Set-Cookie')

    const response = await updateProfileViewsRequest('invalid objectid', cookies)
    expect(response.statusCode).toEqual(400)
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors[0].message).toEqual('Please provide a valid id')
  })

  it('returns a 200 when the profile is already viewed by user', async () => {
    const user1RegisterResponse = await registerRequest({ username: 'user1' })
    expect(user1RegisterResponse.statusCode).toEqual(201)

    const user1LoginResponse = await loginRequest({ username: 'user1' })
    expect(user1LoginResponse.statusCode).toEqual(200)

    const user2RegisterResponse = await registerRequest({ username: 'user2' })
    expect(user2RegisterResponse.statusCode).toEqual(201)

    const user2LoginResponse = await loginRequest({ username: 'user2' })
    expect(user2LoginResponse.statusCode).toEqual(200)

    const user2Cookies = user2LoginResponse.get('Set-Cookie')
    const user1 = await UserModel.findOne({ username: 'user1' })

    const updateProfileViewsResponse1 = await updateProfileViewsRequest(user1?.id, user2Cookies)
    expect(updateProfileViewsResponse1.statusCode).toEqual(200)
    expect(updateProfileViewsResponse1.body.message).toEqual('Profile views updated successfully')
    expect(updateProfileViewsResponse1.body.newAdded).toEqual(true)

    const updateProfileViewsResponse2 = await updateProfileViewsRequest(user1?.id, user2Cookies)
    expect(updateProfileViewsResponse2.statusCode).toEqual(200)
    expect(updateProfileViewsResponse2.body.message).toEqual('Profile views updated successfully')
    expect(updateProfileViewsResponse2.body.newAdded).toEqual(false)
  })

  it('returns a 404 when the user profile is not found with provided id', async () => {
    const user1RegisterResponse = await registerRequest({ username: 'user1' })
    expect(user1RegisterResponse.statusCode).toEqual(201)

    const user1LoginResponse = await loginRequest({ username: 'user1' })
    expect(user1LoginResponse.statusCode).toEqual(200)

    const user1Cookies = user1LoginResponse.get('Set-Cookie')

    const updateQuestionViewResponse = await updateProfileViewsRequest(
      '5e1a0651741b255ddda996c4',
      user1Cookies,
    )
    expect(updateQuestionViewResponse.statusCode).toEqual(404)
    expect(updateQuestionViewResponse.body.errors).toHaveLength(1)
    expect(updateQuestionViewResponse.body.errors[0].message).toEqual('User Profile not found')
  })

  it('returns a 200 when the profile is viewed by the user itself', async () => {
    const user1RegisterResponse = await registerRequest({ username: 'user1' })
    expect(user1RegisterResponse.statusCode).toEqual(201)

    const user1LoginResponse = await loginRequest({ username: 'user1' })
    expect(user1LoginResponse.statusCode).toEqual(200)

    const user1Cookies = user1LoginResponse.get('Set-Cookie')
    const user1 = await UserModel.findOne({ username: 'user1' })

    const updateProfileViewsResponse = await updateProfileViewsRequest(user1?.id, user1Cookies)
    expect(updateProfileViewsResponse.statusCode).toEqual(200)
    expect(updateProfileViewsResponse.body.message).toEqual('Profile views updated successfully')
    expect(updateProfileViewsResponse.body.newAdded).toEqual(false)
  })

  it('returns a 403 when the user is not found', async () => {
    const user1RegisterResponse = await registerRequest({ username: 'user1' })
    expect(user1RegisterResponse.statusCode).toEqual(201)

    const user1LoginResponse = await loginRequest({ username: 'user1' })
    expect(user1LoginResponse.statusCode).toEqual(200)

    const user2RegisterResponse = await registerRequest({ username: 'user2' })
    expect(user2RegisterResponse.statusCode).toEqual(201)

    const user2LoginResponse = await loginRequest({ username: 'user2' })
    expect(user2LoginResponse.statusCode).toEqual(200)

    const user2Cookies = user2LoginResponse.get('Set-Cookie')
    const user1 = await UserModel.findOne({ username: 'user1' })

    await UserModel.deleteOne({ username: 'user2' })

    const updateProfileViewsResponse = await updateProfileViewsRequest(user1?.id, user2Cookies)
    expect(updateProfileViewsResponse.statusCode).toEqual(403)
    expect(updateProfileViewsResponse.body.errors).toHaveLength(1)
    expect(updateProfileViewsResponse.body.errors[0].message).toEqual('Action Forbidden')
  })

  it('successfully updates the profile views and produces a message to kafka', async () => {
    const user1RegisterResponse = await registerRequest({ username: 'user1' })
    expect(user1RegisterResponse.statusCode).toEqual(201)

    const user1LoginResponse = await loginRequest({ username: 'user1' })
    expect(user1LoginResponse.statusCode).toEqual(200)

    const user2RegisterResponse = await registerRequest({ username: 'user2' })
    expect(user2RegisterResponse.statusCode).toEqual(201)

    const user2LoginResponse = await loginRequest({ username: 'user2' })
    expect(user2LoginResponse.statusCode).toEqual(200)

    const user2Cookies = user2LoginResponse.get('Set-Cookie')
    const user1 = await UserModel.findOne({ username: 'user1' })

    const updateProfileViewsResponse = await updateProfileViewsRequest(user1?.id, user2Cookies)
    expect(updateProfileViewsResponse.statusCode).toEqual(200)
    expect(updateProfileViewsResponse.body.message).toEqual('Profile views updated successfully')
    expect(updateProfileViewsResponse.body.newAdded).toEqual(true)
    expect(producer.produce).toHaveBeenCalledTimes(3)
  })
})
