import { createTagRequest, getTagsRequest } from '../helpers'

describe('Get Tags List', () => {
  it('returns a list of tags', async () => {
    const tokens = global.login()
    const createTagResponse1 = await createTagRequest(tokens, { name: 'abc' })
    expect(createTagResponse1.statusCode).toEqual(201)

    const createTagResponse2 = await createTagRequest(tokens, { name: 'def' })
    expect(createTagResponse2.statusCode).toEqual(201)

    const createTagResponse3 = await createTagRequest(tokens, { name: 'ghi' })
    expect(createTagResponse3.statusCode).toEqual(201)

    const response = await getTagsRequest()
    expect(response.statusCode).toEqual(200)
    expect(response.body.tags).toHaveLength(3)
  })

  it('returns a list of tags whoes name matches a specific pattern', async () => {
    const tokens = global.login()
    const createTagResponse1 = await createTagRequest(tokens, { name: 'abc' })
    expect(createTagResponse1.statusCode).toEqual(201)

    const createTagResponse2 = await createTagRequest(tokens, { name: 'aef' })
    expect(createTagResponse2.statusCode).toEqual(201)

    const createTagResponse3 = await createTagRequest(tokens, { name: 'ghi' })
    expect(createTagResponse3.statusCode).toEqual(201)

    const response = await getTagsRequest('name=a')
    expect(response.statusCode).toEqual(200)
    expect(response.body.tags).toHaveLength(2)
  })

  it('returns a list of tags sorted by newest to oldest', async () => {
    const tokens = global.login()
    const createTagResponse1 = await createTagRequest(tokens, { name: 'abc' })
    expect(createTagResponse1.statusCode).toEqual(201)

    const createTagResponse2 = await createTagRequest(tokens, { name: 'def' })
    expect(createTagResponse2.statusCode).toEqual(201)

    const createTagResponse3 = await createTagRequest(tokens, { name: 'ghi' })
    expect(createTagResponse3.statusCode).toEqual(201)

    const response = await getTagsRequest('sort=newest')
    expect(response.statusCode).toEqual(200)
    expect(response.body.tags).toHaveLength(3)
    expect(response.body.tags[0].name).toEqual('ghi')
    expect(response.body.tags[1].name).toEqual('def')
    expect(response.body.tags[2].name).toEqual('abc')
  })

  it('returns a list of tags sorted by oldest to newest', async () => {
    const tokens = global.login()
    const createTagResponse1 = await createTagRequest(tokens, { name: 'abc' })
    expect(createTagResponse1.statusCode).toEqual(201)

    const createTagResponse2 = await createTagRequest(tokens, { name: 'def' })
    expect(createTagResponse2.statusCode).toEqual(201)

    const createTagResponse3 = await createTagRequest(tokens, { name: 'ghi' })
    expect(createTagResponse3.statusCode).toEqual(201)

    const response = await getTagsRequest('sort=oldest')
    expect(response.statusCode).toEqual(200)
    expect(response.body.tags).toHaveLength(3)
    expect(response.body.tags[0].name).toEqual('abc')
    expect(response.body.tags[1].name).toEqual('def')
    expect(response.body.tags[2].name).toEqual('ghi')
  })

  it('returns a list of tags sorted by name', async () => {
    const tokens = global.login()
    const createTagResponse1 = await createTagRequest(tokens, { name: 'abc' })
    expect(createTagResponse1.statusCode).toEqual(201)

    const createTagResponse2 = await createTagRequest(tokens, { name: 'ghi' })
    expect(createTagResponse2.statusCode).toEqual(201)

    const createTagResponse3 = await createTagRequest(tokens, { name: 'aef' })
    expect(createTagResponse3.statusCode).toEqual(201)

    const response = await getTagsRequest('sort=name')
    expect(response.statusCode).toEqual(200)
    expect(response.body.tags).toHaveLength(3)
    expect(response.body.tags[0].name).toEqual('abc')
    expect(response.body.tags[1].name).toEqual('aef')
    expect(response.body.tags[2].name).toEqual('ghi')
  })

  it('skips 0 tags & returns next 2 tags', async () => {
    const tokens = global.login()
    const createTagResponse1 = await createTagRequest(tokens, { name: 'abc' })
    expect(createTagResponse1.statusCode).toEqual(201)

    const createTagResponse2 = await createTagRequest(tokens, { name: 'def' })
    expect(createTagResponse2.statusCode).toEqual(201)

    const createTagResponse3 = await createTagRequest(tokens, { name: 'ghi' })
    expect(createTagResponse3.statusCode).toEqual(201)

    const createTagResponse4 = await createTagRequest(tokens, { name: 'jkl' })
    expect(createTagResponse4.statusCode).toEqual(201)

    const response = await getTagsRequest('pageSize=2&pageNo=1')
    expect(response.statusCode).toEqual(200)
    expect(response.body.tags).toHaveLength(2)
    expect(response.body.tags[0].name).toEqual('abc')
    expect(response.body.tags[1].name).toEqual('def')
  })

  it('skips first 2 tags & returns next 2 tags', async () => {
    const tokens = global.login()
    const createTagResponse1 = await createTagRequest(tokens, { name: 'abc' })
    expect(createTagResponse1.statusCode).toEqual(201)

    const createTagResponse2 = await createTagRequest(tokens, { name: 'def' })
    expect(createTagResponse2.statusCode).toEqual(201)

    const createTagResponse3 = await createTagRequest(tokens, { name: 'ghi' })
    expect(createTagResponse3.statusCode).toEqual(201)

    const createTagResponse4 = await createTagRequest(tokens, { name: 'jkl' })
    expect(createTagResponse4.statusCode).toEqual(201)

    const response = await getTagsRequest('pageSize=2&pageNo=2')
    expect(response.statusCode).toEqual(200)
    expect(response.body.tags).toHaveLength(2)
    expect(response.body.tags[0].name).toEqual('ghi')
    expect(response.body.tags[1].name).toEqual('jkl')
  })

  it('matches tags name with specific pattern & then sorts them from newest to oldest & at last returns next 2 tags by skipping first 2', async () => {
    const tokens = global.login()
    const createTagResponse1 = await createTagRequest(tokens, { name: 'abc' })
    expect(createTagResponse1.statusCode).toEqual(201)

    const createTagResponse2 = await createTagRequest(tokens, { name: 'nef' })
    expect(createTagResponse2.statusCode).toEqual(201)

    const createTagResponse3 = await createTagRequest(tokens, { name: 'gni' })
    expect(createTagResponse3.statusCode).toEqual(201)

    const createTagResponse4 = await createTagRequest(tokens, { name: 'jkl' })
    expect(createTagResponse4.statusCode).toEqual(201)

    const createTagResponse5 = await createTagRequest(tokens, { name: 'mno' })
    expect(createTagResponse5.statusCode).toEqual(201)

    const createTagResponse6 = await createTagRequest(tokens, { name: 'pqn' })
    expect(createTagResponse6.statusCode).toEqual(201)

    const response = await getTagsRequest('name=n&sort=newest&pageSize=2&pageNo=2')
    expect(response.statusCode).toEqual(200)
    expect(response.body.tags).toHaveLength(2)
    expect(response.body.tags[0].name).toEqual('gni')
    expect(response.body.tags[1].name).toEqual('nef')
  })
})
