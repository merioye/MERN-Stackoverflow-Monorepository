import * as dotenv from 'dotenv'

dotenv.config()

export interface EnvVars {
  NODE_ENV: string | undefined
  PORT: string | undefined
  TESTING_JWT_SECRET: string | undefined
  POSTGRES_URI: string | undefined
  POSTGRES_DATABASE: string | undefined
  REDIS_URI: string | undefined
  REDIS_TTL: number
  JWKS_URI: string | undefined
  KAFKA_CLIENT_ID: string | undefined
  KAFKA_NUM_PARTITIONS: number | undefined
  KAFKA_REPLICATION_FACTOR: number | undefined
  KAFKA_BROKERS_LIST: string[] | undefined
}

const envVars = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  TESTING_JWT_SECRET: process.env.TESTING_JWT_SECRET,
  POSTGRES_URI: process.env.POSTGRES_URI,
  POSTGRES_DATABASE: process.env.POSTGRES_DATABASE,
  REDIS_URI: process.env.REDIS_URI,
  REDIS_TTL: Number(process.env.REDIS_TTL),
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
