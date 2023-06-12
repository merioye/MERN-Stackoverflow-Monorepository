import { RedisClientType, createClient } from 'redis'

export class RedisService {
  client: RedisClientType

  constructor(redisUri: string) {
    this.client = createClient({ url: redisUri })
    this.client.on('error', (error) => {
      console.error('Error connecting to Redis: ', error)
    })
  }

  connect = async (): Promise<void> => {
    await this.client.connect()
  }

  disconnect = async (): Promise<void> => {
    await this.client.disconnect()
  }
}
