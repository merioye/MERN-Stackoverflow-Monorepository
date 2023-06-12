import { JwtService } from 'stackoverflow-server-common'
import { Algorithm } from 'jsonwebtoken'
import { TestDataSource } from './config/TestDataSource'
import { createTags, createUsers } from './helpers/question-test.helpers'
import { getEnvVars } from './config/constants'

const { TESTING_JWT_SECRET } = getEnvVars()

interface Payload {
  userId: string
}

declare global {
  // eslint-disable-next-line
  function login(user?: { userId: string }): string[]
}

jest.mock('./config/cache')
jest.mock('./kafka/components/producer')
jest.mock('./kafka/components/consumer')

jest.setTimeout(100000)

beforeAll(async () => {
  await TestDataSource.initialize()
})

beforeEach(async () => {
  await TestDataSource.dropDatabase()
  await TestDataSource.synchronize(true)
  await createUsers()
  await createTags()
  jest.clearAllMocks()
})

afterAll(async () => {
  await TestDataSource.dropDatabase()
  await TestDataSource.destroy()
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
