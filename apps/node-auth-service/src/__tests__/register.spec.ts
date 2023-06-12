import { Topics } from 'stackoverflow-server-common'
import { registerRequest, user } from '../helpers'
import { producer } from '../kafka'

describe('Register User', () => {
  it('returns a 400 when invalid username is provided', async () => {
    const response = await registerRequest({ username: 'a1%' })

    expect(response.statusCode).toEqual(400)
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors[0].field).toEqual('username')
  })

  it('returns a 400 when invalid password is provided', async () => {
    const response = await registerRequest({ password: '123' })

    expect(response.statusCode).toEqual(400)
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors[0].field).toEqual('password')
  })

  it('returns a 400 when invalid avartar > url is provided', async () => {
    const response = await registerRequest({ avatar: { ...user.avatar, url: 'abc' } })

    expect(response.statusCode).toEqual(400)
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors[0].field).toEqual('avatar')
  })

  it('returns a 400 when invalid avartar > cloudinaryId is provided', async () => {
    const response = await registerRequest({ avatar: { ...user.avatar, cloudinaryId: '' } })

    expect(response.statusCode).toEqual(400)
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors[0].field).toEqual('avatar')
  })

  it('returns a 409 when the user already exists with provided username', async () => {
    const response1 = await registerRequest({})
    expect(response1.statusCode).toEqual(201)

    const response2 = await registerRequest({})
    expect(response2.statusCode).toEqual(409)
    expect(response2.body.errors).toHaveLength(1)
    expect(response2.body.errors[0].message).toEqual('User already exists')
  })

  it('returns a 201 and produces a message to kafka on successfull registration', async () => {
    const response = await registerRequest({})

    expect(response.statusCode).toEqual(201)
    expect(response.body.message).toEqual('Registration successfull')
    expect(producer.produce).toHaveBeenCalledWith(
      Topics.UserCreated,
      expect.objectContaining({ username: 'abc' }),
    )
  })
})
