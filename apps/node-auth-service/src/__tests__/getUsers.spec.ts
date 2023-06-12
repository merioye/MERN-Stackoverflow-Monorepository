import { getUsersRequest, registerRequest } from '../helpers'

describe('Get Users List', () => {
  it('returns a list of users', async () => {
    const registerResponse1 = await registerRequest({ username: 'abc' })
    expect(registerResponse1.statusCode).toEqual(201)

    const registerResponse2 = await registerRequest({ username: 'def' })
    expect(registerResponse2.statusCode).toEqual(201)

    const registerResponse3 = await registerRequest({ username: 'ghi' })
    expect(registerResponse3.statusCode).toEqual(201)

    const response = await getUsersRequest()
    expect(response.statusCode).toEqual(200)
    expect(response.body.users).toHaveLength(3)
  })

  it('returns a list of users whoes username matches a specific pattern', async () => {
    const registerResponse1 = await registerRequest({ username: 'abc' })
    expect(registerResponse1.statusCode).toEqual(201)

    const registerResponse2 = await registerRequest({ username: 'aef' })
    expect(registerResponse2.statusCode).toEqual(201)

    const registerResponse3 = await registerRequest({ username: 'ghi' })
    expect(registerResponse3.statusCode).toEqual(201)

    const response = await getUsersRequest('username=a')
    expect(response.statusCode).toEqual(200)
    expect(response.body.users).toHaveLength(2)
  })

  it('returns a list of users sorted by newest to oldest', async () => {
    const registerResponse1 = await registerRequest({ username: 'abc' })
    expect(registerResponse1.statusCode).toEqual(201)

    const registerResponse2 = await registerRequest({ username: 'def' })
    expect(registerResponse2.statusCode).toEqual(201)

    const registerResponse3 = await registerRequest({ username: 'ghi' })
    expect(registerResponse3.statusCode).toEqual(201)

    const response = await getUsersRequest('sort=newest')
    expect(response.statusCode).toEqual(200)
    expect(response.body.users).toHaveLength(3)
    expect(response.body.users[0].username).toEqual('ghi')
    expect(response.body.users[1].username).toEqual('def')
    expect(response.body.users[2].username).toEqual('abc')
  })

  it('returns a list of users sorted by oldest to newest', async () => {
    const registerResponse1 = await registerRequest({ username: 'abc' })
    expect(registerResponse1.statusCode).toEqual(201)

    const registerResponse2 = await registerRequest({ username: 'def' })
    expect(registerResponse2.statusCode).toEqual(201)

    const registerResponse3 = await registerRequest({ username: 'ghi' })
    expect(registerResponse3.statusCode).toEqual(201)

    const response = await getUsersRequest('sort=oldest')
    expect(response.statusCode).toEqual(200)
    expect(response.body.users).toHaveLength(3)
    expect(response.body.users[0].username).toEqual('abc')
    expect(response.body.users[1].username).toEqual('def')
    expect(response.body.users[2].username).toEqual('ghi')
  })

  it('returns a list of users sorted by username', async () => {
    const registerResponse1 = await registerRequest({ username: 'abc' })
    expect(registerResponse1.statusCode).toEqual(201)

    const registerResponse2 = await registerRequest({ username: 'ghi' })
    expect(registerResponse2.statusCode).toEqual(201)

    const registerResponse3 = await registerRequest({ username: 'aef' })
    expect(registerResponse3.statusCode).toEqual(201)

    const response = await getUsersRequest('sort=name')
    expect(response.statusCode).toEqual(200)
    expect(response.body.users).toHaveLength(3)
    expect(response.body.users[0].username).toEqual('abc')
    expect(response.body.users[1].username).toEqual('aef')
    expect(response.body.users[2].username).toEqual('ghi')
  })

  it('skips 0 users & returns next 2 users', async () => {
    const registerResponse1 = await registerRequest({ username: 'abc' })
    expect(registerResponse1.statusCode).toEqual(201)

    const registerResponse2 = await registerRequest({ username: 'def' })
    expect(registerResponse2.statusCode).toEqual(201)

    const registerResponse3 = await registerRequest({ username: 'ghi' })
    expect(registerResponse3.statusCode).toEqual(201)

    const registerResponse4 = await registerRequest({ username: 'jkl' })
    expect(registerResponse4.statusCode).toEqual(201)

    const response = await getUsersRequest('pageSize=2&pageNo=1')
    expect(response.statusCode).toEqual(200)
    expect(response.body.users).toHaveLength(2)
    expect(response.body.users[0].username).toEqual('abc')
    expect(response.body.users[1].username).toEqual('def')
  })

  it('skips first 2 users & returns next 2 users', async () => {
    const registerResponse1 = await registerRequest({ username: 'abc' })
    expect(registerResponse1.statusCode).toEqual(201)

    const registerResponse2 = await registerRequest({ username: 'def' })
    expect(registerResponse2.statusCode).toEqual(201)

    const registerResponse3 = await registerRequest({ username: 'ghi' })
    expect(registerResponse3.statusCode).toEqual(201)

    const registerResponse4 = await registerRequest({ username: 'jkl' })
    expect(registerResponse4.statusCode).toEqual(201)

    const response = await getUsersRequest('pageSize=2&pageNo=2')
    expect(response.statusCode).toEqual(200)
    expect(response.body.users).toHaveLength(2)
    expect(response.body.users[0].username).toEqual('ghi')
    expect(response.body.users[1].username).toEqual('jkl')
  })

  it('matches users username with specific pattern & then sorts them from newest to oldest & at last returns next 2 users by skipping first 2', async () => {
    const registerResponse1 = await registerRequest({ username: 'abc' })
    expect(registerResponse1.statusCode).toEqual(201)

    const registerResponse2 = await registerRequest({ username: 'nef' })
    expect(registerResponse2.statusCode).toEqual(201)

    const registerResponse3 = await registerRequest({ username: 'gni' })
    expect(registerResponse3.statusCode).toEqual(201)

    const registerResponse4 = await registerRequest({ username: 'jkl' })
    expect(registerResponse4.statusCode).toEqual(201)

    const registerResponse5 = await registerRequest({ username: 'mno' })
    expect(registerResponse5.statusCode).toEqual(201)

    const registerResponse6 = await registerRequest({ username: 'pqn' })
    expect(registerResponse6.statusCode).toEqual(201)

    const response = await getUsersRequest('username=n&sort=newest&pageSize=2&pageNo=2')
    expect(response.statusCode).toEqual(200)
    expect(response.body.users).toHaveLength(2)
    expect(response.body.users[0].username).toEqual('gni')
    expect(response.body.users[1].username).toEqual('nef')
  })
})
