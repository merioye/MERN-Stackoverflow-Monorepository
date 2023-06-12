import { CacheKeysService } from 'stackoverflow-server-common'
import { redisClient } from './redis'

export const cacheKeysService = new CacheKeysService(redisClient)
