import { EnvService } from 'stackoverflow-server-common'
import { applySpeedGooseCacheLayer } from 'speedgoose'
import mongoose from 'mongoose'
import { app } from './app'
import { EnvVars, getEnvVars } from './config/constants'
import { redisService } from './config/redis'
import { logger } from './logger'
import { disconnectFromKafka, registerKafkaConsumers } from './kafka'

const envVars = getEnvVars()
const { PORT, MONGO_URI, REDIS_URI, REDIS_TTL } = envVars

const start = async () => {
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

  app.listen(PORT, () => logger.info(`Tag service listening on ${PORT} 🚀`))
}

start().catch((e) => logger.error(e))
