import { logoutRequest } from '../helpers'

describe('Logout User', () => {
  it('returns a 401 when the user is not logged in', async () => {
    const response = await logoutRequest([])

    expect(response.statusCode).toEqual(401)
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors[0].message).toEqual('Invalid token...')
  })

  it('should clear the cookies on successfull logout', async () => {
    const cookies = await global.login()

    const logoutResponse = await logoutRequest(cookies)
    expect(logoutResponse.statusCode).toEqual(200)
    expect(logoutResponse.body.message).toEqual('Logout successfull')
    expect(logoutResponse.get('Set-Cookie')[0]).toEqual(
      'accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
    )
    expect(logoutResponse.get('Set-Cookie')[1]).toEqual(
      'refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
    )
  })
})
