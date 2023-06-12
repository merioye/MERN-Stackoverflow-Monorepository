import * as dotenv from 'dotenv'

dotenv.config()

export interface EnvVars {
  NODE_ENV: string | undefined
  PORT: string | undefined
  MONGO_URI: string | undefined
  REDIS_URI: string | undefined
  REDIS_TTL: number | undefined
  HASH_SALT_ROUNDS: string | undefined
  ACCESS_TOKEN_PRIVATE_KEY: string | undefined
  ACCESS_TOKEN_PUBLIC_KEY: string | undefined
  REFRESH_TOKEN_PRIVATE_KEY: string | undefined
  REFRESH_TOKEN_PUBLIC_KEY: string | undefined
  ACCESS_TOKEN_EXPIRY: string | undefined
  REFRESH_TOKEN_EXPIRY: string | undefined
  ACCESS_TOKEN_COOKIE_EXPIRY: string | undefined
  REFRESH_TOKEN_COOKIE_EXPIRY: string | undefined
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
  HASH_SALT_ROUNDS: process.env.HASH_SALT_ROUNDS,
  ACCESS_TOKEN_PRIVATE_KEY: process.env.ACCESS_TOKEN_PRIVATE_KEY,
  ACCESS_TOKEN_PUBLIC_KEY: process.env.ACCESS_TOKEN_PUBLIC_KEY,
  REFRESH_TOKEN_PRIVATE_KEY: process.env.REFRESH_TOKEN_PRIVATE_KEY,
  REFRESH_TOKEN_PUBLIC_KEY: process.env.REFRESH_TOKEN_PUBLIC_KEY,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY,
  ACCESS_TOKEN_COOKIE_EXPIRY: process.env.ACCESS_TOKEN_COOKIE_EXPIRY,
  REFRESH_TOKEN_COOKIE_EXPIRY: process.env.REFRESH_TOKEN_COOKIE_EXPIRY,
  KAFKA_CLIENT_ID: process.env.KAFKA_CLIENT_ID,
  KAFKA_NUM_PARTITIONS: Number(process.env.KAFKA_NUM_PARTITIONS),
  KAFKA_REPLICATION_FACTOR: Number(process.env.KAFKA_REPLICATION_FACTOR),
  KAFKA_BROKERS_LIST: process.env.KAFKA_BROKERS_LIST?.split(','),
}

export const getEnvVars = (): EnvVars => {
  if (process.env.NODE_ENV !== 'production') {
    delete envVars.ACCESS_TOKEN_PRIVATE_KEY
    delete envVars.ACCESS_TOKEN_PUBLIC_KEY
    delete envVars.REFRESH_TOKEN_PRIVATE_KEY
    delete envVars.REFRESH_TOKEN_PUBLIC_KEY
  }
  return envVars
}
