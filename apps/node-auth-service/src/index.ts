import mongoose from 'mongoose'
import { applySpeedGooseCacheLayer } from 'speedgoose'
import { EnvService } from 'stackoverflow-server-common'

import { app } from './app'
import { redisService } from './config/redis'
import { EnvVars, getEnvVars } from './config/constants'
import { logger } from './logger'
import { disconnectFromKafka, registerKafkaConsumers } from './kafka'

const envVars = getEnvVars()
const { PORT, MONGO_URI, REDIS_URI, REDIS_TTL } = envVars

const start = async (): Promise<void> => {
  const envService = new EnvService<EnvVars>(envVars)
  envService.requireEnvVars()

  process.on('SIGINT', async () => await disconnectFromKafka())
  process.on('SIGTERM', async () => await disconnectFromKafka())
  await registerKafkaConsumers()

  await mongoose.connect(MONGO_URI!)
  logger.info('Connected to db')

  await redisService.connect()
  logger.info('Connected to redis')

  applySpeedGooseCacheLayer(mongoose, {
    redisUri: REDIS_URI,
    defaultTtl: REDIS_TTL,
  })

  app.listen(PORT, () => logger.info(`Auth service listening on ${PORT} 🚀`))
}

start().catch((e) => logger.error(e))
