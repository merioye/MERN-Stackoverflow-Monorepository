import { whoAmIRequest } from '../helpers'

describe('Get whoAmI data', () => {
  it('returns a 401 when the user is not logged in', async () => {
    const response = await whoAmIRequest([])

    expect(response.statusCode).toEqual(401)
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors[0].message).toEqual('Invalid token...')
  })

  it('should respond with logged in user data', async () => {
    const cookies = await global.login()

    const response = await whoAmIRequest(cookies)

    expect(response.statusCode).toEqual(200)
    expect(response.body.user.username).toEqual('abc')
  })
})
