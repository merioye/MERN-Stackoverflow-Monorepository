import { MongoMemoryServer } from 'mongodb-memory-server'
import { applySpeedGooseCacheLayer } from 'speedgoose'
import mongoose from 'mongoose'
import { registerRequest, loginRequest } from './helpers/auth-test.helpers'

declare global {
  function login(): Promise<string[]>
}

jest.mock('./kafka/components/producer')
jest.mock('./kafka/components/consumer')

jest.setTimeout(100000)

let mongod: MongoMemoryServer

beforeAll(async () => {
  mongod = await MongoMemoryServer.create({
    instance: {
      dbName: 'auth-test',
    },
  })
  const mongoUri = mongod.getUri()
  await mongoose.connect(mongoUri)
  applySpeedGooseCacheLayer(mongoose, { enabled: false })
  jest.clearAllMocks()
})

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections()
  for (const collection of collections) {
    await collection.deleteMany({})
  }
})

afterAll(async () => {
  await mongod.stop()
  await mongoose.connection.close()
})

global.login = async () => {
  const registerResponse = await registerRequest({})
  expect(registerResponse.statusCode).toEqual(201)

  const loginResponse = await loginRequest({})
  expect(loginResponse.statusCode).toEqual(200)

  const cookies = loginResponse.get('Set-Cookie')
  return cookies
}
