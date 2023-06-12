import { loginRequest, registerRequest } from '../helpers'

describe('Login User', () => {
  it('returns a 400 when username is not provided', async () => {
    const response = await loginRequest({ username: '' })

    expect(response.statusCode).toEqual(400)
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors[0].field).toEqual('username')
  })

  it('returns a 400 when password is not provided', async () => {
    const response = await loginRequest({ password: '' })

    expect(response.statusCode).toEqual(400)
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors[0].field).toEqual('password')
  })

  it('returns a 404 when provided username does not exist', async () => {
    const response = await loginRequest({ username: 'cdf' })

    expect(response.statusCode).toEqual(404)
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors[0].message).toEqual('Invalid credentials')
  })

  it('returns a 404 when password is incorrect', async () => {
    const registerResponse = await registerRequest({})
    expect(registerResponse.statusCode).toEqual(201)

    const loginResponse = await loginRequest({ password: '123' })
    expect(loginResponse.statusCode).toEqual(404)
    expect(loginResponse.body.errors).toHaveLength(1)
    expect(loginResponse.body.errors[0].message).toEqual('Invalid credentials')
  })

  it('responds with cookies when valid credentials are provided', async () => {
    const registerResponse = await registerRequest({})
    expect(registerResponse.statusCode).toEqual(201)

    const loginResponse = await loginRequest({})
    expect(loginResponse.statusCode).toEqual(200)
    expect(loginResponse.body.message).toEqual('Login successfull')
    expect(loginResponse.get('Set-Cookie')).toHaveLength(2)
  })
})
