import { RedisService } from 'stackoverflow-server-common'
import { getEnvVars } from './constants'

const { REDIS_URI } = getEnvVars()

export const redisService = new RedisService(REDIS_URI!)
export const redisClient = redisService.client
