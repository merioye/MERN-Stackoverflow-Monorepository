import { createQuestionRequest, getQuestionsRequest } from '../helpers'

describe('Get list of questions', () => {
  it('returns a list of questions', async () => {
    const tokens = global.login()

    const createQuestionResponse1 = await createQuestionRequest(tokens)
    expect(createQuestionResponse1.statusCode).toEqual(201)

    const createQuestionResponse2 = await createQuestionRequest(tokens)
    expect(createQuestionResponse2.statusCode).toEqual(201)

    const createQuestionResponse3 = await createQuestionRequest(tokens)
    expect(createQuestionResponse3.statusCode).toEqual(201)

    const response = await getQuestionsRequest()
    const questions = response.body.questions

    expect(response.statusCode).toEqual(200)
    expect(questions).toHaveLength(3)
  })

  it('returns a list of questions whoes title matches a specific pattern', async () => {
    const tokens = global.login()

    const createQuestionResponse1 = await createQuestionRequest(tokens, { title: 'abcd' })
    expect(createQuestionResponse1.statusCode).toEqual(201)

    const createQuestionResponse2 = await createQuestionRequest(tokens)
    expect(createQuestionResponse2.statusCode).toEqual(201)

    const createQuestionResponse3 = await createQuestionRequest(tokens)
    expect(createQuestionResponse3.statusCode).toEqual(201)

    const response = await getQuestionsRequest('keyword=cd')
    const questions = response.body.questions

    expect(response.statusCode).toEqual(200)
    expect(questions).toHaveLength(1)
  })

  it('returns a list of questions whoes tagName matches a specific pattern', async () => {
    const tokens = global.login()

    const createQuestionResponse1 = await createQuestionRequest(tokens, {
      tagsIds: ['507f1f77bcf86cd799439011'],
    })
    expect(createQuestionResponse1.statusCode).toEqual(201)

    const createQuestionResponse2 = await createQuestionRequest(tokens, {
      tagsIds: ['507f191e810c19729de860ea'],
    })
    expect(createQuestionResponse2.statusCode).toEqual(201)

    const createQuestionResponse3 = await createQuestionRequest(tokens, {
      tagsIds: ['00000020f51bb4362eee2a4d'],
    })
    expect(createQuestionResponse3.statusCode).toEqual(201)

    const response = await getQuestionsRequest('keyword=thon')
    const questions = response.body.questions

    expect(response.statusCode).toEqual(200)
    expect(questions).toHaveLength(1)
  })

  it('returns a list of questions whoes title/tagName matches a specific pattern', async () => {
    const tokens = global.login()

    const createQuestionResponse1 = await createQuestionRequest(tokens)
    expect(createQuestionResponse1.statusCode).toEqual(201)

    const createQuestionResponse2 = await createQuestionRequest(tokens, {
      title: 'web dev is awesome?',
    })
    expect(createQuestionResponse2.statusCode).toEqual(201)

    const createQuestionResponse3 = await createQuestionRequest(tokens, {
      tagsIds: ['00000020f51bb4362eee2a4d'],
    })
    expect(createQuestionResponse3.statusCode).toEqual(201)

    const response = await getQuestionsRequest('keyword=web')
    const questions = response.body.questions

    expect(response.statusCode).toEqual(200)
    expect(questions).toHaveLength(2)
  })

  it('returns a list of questions sorted by newest to oldest', async () => {
    const tokens = global.login()

    const createQuestionResponse1 = await createQuestionRequest(tokens, { title: 'abc' })
    expect(createQuestionResponse1.statusCode).toEqual(201)

    const createQuestionResponse2 = await createQuestionRequest(tokens, { title: 'def' })
    expect(createQuestionResponse2.statusCode).toEqual(201)

    const createQuestionResponse3 = await createQuestionRequest(tokens, { title: 'ghi' })
    expect(createQuestionResponse3.statusCode).toEqual(201)

    const response = await getQuestionsRequest('sort=newest')
    const questions = response.body.questions

    expect(response.statusCode).toEqual(200)
    expect(questions).toHaveLength(3)
    expect(questions[0].title).toEqual('ghi')
    expect(questions[1].title).toEqual('def')
    expect(questions[2].title).toEqual('abc')
  })

  it('returns a list of questions sorted by oldest to newest', async () => {
    const tokens = global.login()

    const createQuestionResponse1 = await createQuestionRequest(tokens, { title: 'abc' })
    expect(createQuestionResponse1.statusCode).toEqual(201)

    const createQuestionResponse2 = await createQuestionRequest(tokens, { title: 'def' })
    expect(createQuestionResponse2.statusCode).toEqual(201)

    const createQuestionResponse3 = await createQuestionRequest(tokens, { title: 'ghi' })
    expect(createQuestionResponse3.statusCode).toEqual(201)

    const response = await getQuestionsRequest('sort=oldest')
    const questions = response.body.questions

    expect(response.statusCode).toEqual(200)
    expect(questions).toHaveLength(3)
    expect(questions[0].title).toEqual('abc')
    expect(questions[1].title).toEqual('def')
    expect(questions[2].title).toEqual('ghi')
  })

  it('returns a list of questions sorted by title', async () => {
    const tokens = global.login()

    const createQuestionResponse1 = await createQuestionRequest(tokens, { title: 'abc' })
    expect(createQuestionResponse1.statusCode).toEqual(201)

    const createQuestionResponse2 = await createQuestionRequest(tokens, { title: 'ghi' })
    expect(createQuestionResponse2.statusCode).toEqual(201)

    const createQuestionResponse3 = await createQuestionRequest(tokens, { title: 'aef' })
    expect(createQuestionResponse3.statusCode).toEqual(201)

    const response = await getQuestionsRequest('sort=name')
    const questions = response.body.questions

    expect(response.statusCode).toEqual(200)
    expect(questions).toHaveLength(3)
    expect(questions[0].title).toEqual('abc')
    expect(questions[1].title).toEqual('aef')
    expect(questions[2].title).toEqual('ghi')
  })

  it('skips 0 questions & returns next 2 questions', async () => {
    const tokens = global.login()

    const createQuestionResponse1 = await createQuestionRequest(tokens, { title: 'abc' })
    expect(createQuestionResponse1.statusCode).toEqual(201)

    const createQuestionResponse2 = await createQuestionRequest(tokens, { title: 'def' })
    expect(createQuestionResponse2.statusCode).toEqual(201)

    const createQuestionResponse3 = await createQuestionRequest(tokens, { title: 'ghi' })
    expect(createQuestionResponse3.statusCode).toEqual(201)

    const createQuestionResponse4 = await createQuestionRequest(tokens, { title: 'jkl' })
    expect(createQuestionResponse4.statusCode).toEqual(201)

    const response = await getQuestionsRequest('pageSize=2&pageNo=1')
    const questions = response.body.questions

    expect(response.statusCode).toEqual(200)
    expect(questions).toHaveLength(2)
    expect(questions[0].title).toEqual('abc')
    expect(questions[1].title).toEqual('def')
  })

  it('skips first 2 questions & returns next 2 questions', async () => {
    const tokens = global.login()

    const createQuestionResponse1 = await createQuestionRequest(tokens, { title: 'abc' })
    expect(createQuestionResponse1.statusCode).toEqual(201)

    const createQuestionResponse2 = await createQuestionRequest(tokens, { title: 'def' })
    expect(createQuestionResponse2.statusCode).toEqual(201)

    const createQuestionResponse3 = await createQuestionRequest(tokens, { title: 'ghi' })
    expect(createQuestionResponse3.statusCode).toEqual(201)

    const createQuestionResponse4 = await createQuestionRequest(tokens, { title: 'jkl' })
    expect(createQuestionResponse4.statusCode).toEqual(201)

    const response = await getQuestionsRequest('pageSize=2&pageNo=2')
    const questions = response.body.questions

    expect(response.statusCode).toEqual(200)
    expect(questions).toHaveLength(2)
    expect(questions[0].title).toEqual('ghi')
    expect(questions[1].title).toEqual('jkl')
  })

  it('matches questions title/tagName with specific pattern & then sorts them from newest to oldest & at last returns next 2 questions by skipping first 2', async () => {
    const tokens = global.login()

    const createQuestionResponse1 = await createQuestionRequest(tokens, {
      title: 'abc',
      tagsIds: ['507f1f77bcf86cd799439011'],
    })
    expect(createQuestionResponse1.statusCode).toEqual(201)

    const createQuestionResponse2 = await createQuestionRequest(tokens, {
      title: 'nef',
      tagsIds: ['507f1f77bcf86cd799439011'],
    })
    expect(createQuestionResponse2.statusCode).toEqual(201)

    const createQuestionResponse3 = await createQuestionRequest(tokens, {
      title: 'gni',
      tagsIds: ['507f1f77bcf86cd799439011'],
    })
    expect(createQuestionResponse3.statusCode).toEqual(201)

    const createQuestionResponse4 = await createQuestionRequest(tokens, {
      title: 'jkl',
      tagsIds: ['507f1f77bcf86cd799439011'],
    })
    expect(createQuestionResponse4.statusCode).toEqual(201)

    const createQuestionResponse5 = await createQuestionRequest(tokens, {
      title: 'mno',
      tagsIds: ['507f1f77bcf86cd799439011'],
    })
    expect(createQuestionResponse5.statusCode).toEqual(201)

    const createQuestionResponse6 = await createQuestionRequest(tokens, {
      title: 'pqn',
      tagsIds: ['507f1f77bcf86cd799439011'],
    })
    expect(createQuestionResponse6.statusCode).toEqual(201)

    const response = await getQuestionsRequest('keyword=n&sort=newest&pageSize=2&pageNo=2')
    const questions = response.body.questions

    expect(response.statusCode).toEqual(200)
    expect(questions).toHaveLength(2)
    expect(questions[0].title).toEqual('gni')
    expect(questions[1].title).toEqual('nef')
  })
})
