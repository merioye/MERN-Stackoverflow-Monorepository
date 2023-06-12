import 'reflect-metadata'
import { EnvService } from 'stackoverflow-server-common'
import { AppDataSource } from './config/AppDataSource'
import { app } from './app'
import { getEnvVars, EnvVars } from './config/constants'
import { redisService } from './config/redis'
import { logger } from './logger'
import { disconnectFromKafka, registerKafkaConsumers } from './kafka'

const envVars = getEnvVars()
const { PORT } = envVars

const start = async () => {
  const envService = new EnvService<EnvVars>(envVars)
  envService.requireEnvVars()

  process.on('SIGINT', async () => await disconnectFromKafka())
  process.on('SIGTERM', async () => await disconnectFromKafka())
  await registerKafkaConsumers()

  await AppDataSource.initialize()
  logger.info('Connected to db')

  await redisService.connect()
  logger.info('Connected to redis')

  app.listen(PORT, () => {
    logger.info(`QNA service listening on ${PORT} 🚀`)
  })
}

start().catch((e) => logger.error(e))
