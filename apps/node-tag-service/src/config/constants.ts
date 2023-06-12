import * as dotenv from 'dotenv'

dotenv.config()

export interface EnvVars {
  NODE_ENV: string | undefined
  PORT: string | undefined
  MONGO_URI: string | undefined
  REDIS_URI: string | undefined
  REDIS_TTL: number | undefined
  TESTING_JWT_SECRET: string | undefined
  JWKS_URI: string | undefined
  KAFKA_CLIENT_ID: string | undefined
  KAFKA_NUM_PARTITIONS: number | undefined
  KAFKA_REPLICATION_FACTOR: number | undefined
  KAFKA_BROKERS_LIST: string[] | undefined
}

const envVars = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  REDIS_URI: process.env.REDIS_URI,
  REDIS_TTL: Number(process.env.REDIS_TTL),
  TESTING_JWT_SECRET: process.env.TESTING_JWT_SECRET,
  JWKS_URI: process.env.JWKS_URI,
  KAFKA_CLIENT_ID: process.env.KAFKA_CLIENT_ID,
  KAFKA_NUM_PARTITIONS: Number(process.env.KAFKA_NUM_PARTITIONS),
  KAFKA_REPLICATION_FACTOR: Number(process.env.KAFKA_REPLICATION_FACTOR),
  KAFKA_BROKERS_LIST: process.env.KAFKA_BROKERS_LIST?.split(','),
}

export const getEnvVars = (): EnvVars => {
  if (process.env.NODE_ENV !== 'test') {
    delete envVars['TESTING_JWT_SECRET']
  }
  return envVars
}
