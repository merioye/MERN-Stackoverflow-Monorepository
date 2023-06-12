import { UserModel, RefreshTokenModel } from '../models'
import { refreshRequest } from '../helpers'

describe('Renew JWT Tokens', () => {
  it('returns a 401 when refresh token is missing in cookies', async () => {
    const response = await refreshRequest()

    expect(response.statusCode).toEqual(401)
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors[0].message).toEqual('Not Authorized')
  })

  it('returns a 401 when a tempered refresh token is provided', async () => {
    const response = await refreshRequest('invalidrefreshtoken')

    expect(response.statusCode).toEqual(401)
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors[0].message).toEqual('Not Authorized')
  })

  it('returns a 401 when refresh token decoded payload user does not exist', async () => {
    const cookies = await global.login()

    await UserModel.deleteOne({ username: 'abc' })

    const response = await refreshRequest(cookies[1])

    expect(response.statusCode).toEqual(401)
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors[0].message).toEqual('Not Authorized')
  })

  it('returns a 401 when provided refresh token does not exist in db', async () => {
    const cookies = await global.login()
    const refreshToken = cookies[1]
    const token = refreshToken.split(';')[0].split('=')[1]

    const user = await UserModel.findOne({ username: 'abc' })
    await RefreshTokenModel.deleteOne({ userId: user?.id, token })

    const response = await refreshRequest(refreshToken)

    expect(response.statusCode).toEqual(401)
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors[0].message).toEqual('Not Authorized')
  })

  it('should respond with new jwt tokens', async () => {
    const cookies = await global.login()

    const response = await refreshRequest(cookies[1])

    expect(response.statusCode).toEqual(200)
    expect(response.body.message).toEqual('Tokens have been re-issued')
    expect(response.get('Set-Cookie')).toHaveLength(2)
  })
})
