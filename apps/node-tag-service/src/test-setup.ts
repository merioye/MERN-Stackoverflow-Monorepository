import { JwtService } from 'stackoverflow-server-common'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { applySpeedGooseCacheLayer } from 'speedgoose'
import mongoose from 'mongoose'
import { Algorithm } from 'jsonwebtoken'
import { getEnvVars } from './config/constants'
import { createUsers } from './helpers'

const { TESTING_JWT_SECRET } = getEnvVars()

declare global {
  // eslint-disable-next-line
  function login(user?: { userId: string }): string[]
}

jest.mock('./kafka/components/producer')
jest.mock('./kafka/components/consumer')

jest.setTimeout(100000)

interface Payload {
  userId: string
}

let mongod: MongoMemoryServer

beforeAll(async () => {
  mongod = await MongoMemoryServer.create({
    instance: {
      dbName: 'tag-test',
    },
  })
  const mongoUri = mongod.getUri()
  await mongoose.connect(mongoUri)
  applySpeedGooseCacheLayer(mongoose, { enabled: false })
})

beforeEach(async () => {
  await createUsers()
  jest.clearAllMocks()
})

afterEach(async () => {
  const collections = await mongoose.connection.db.collections()
  for (const collection of collections) {
    await collection.deleteMany({})
  }
})

afterAll(async () => {
  await mongod.stop()
  await mongoose.connection.close()
})

global.login = (user?: { userId: string }): string[] => {
  const payload = {
    userId: user ? user.userId : '6423c07564c35144c5c7f611',
  }
  const accessTokenOptions = {
    secret: TESTING_JWT_SECRET!,
    expiresIn: '1h',
    algorithm: 'HS256' as Algorithm,
  }
  const refreshTokenOptions = {
    secret: TESTING_JWT_SECRET!,
    expiresIn: '1y',
    algorithm: 'HS256' as Algorithm,
  }

  const jwtService = new JwtService<Payload>()
  const { accessToken, refreshToken } = jwtService.generateTokens(
    payload,
    accessTokenOptions,
    refreshTokenOptions,
  )

  return [accessToken, refreshToken]
}
