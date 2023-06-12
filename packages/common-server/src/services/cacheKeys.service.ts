import { RedisClientType } from 'redis'

export class CacheKeysService {
  private client

  constructor(client: RedisClientType) {
    this.client = client
  }

  deleteKeys = async (patterns: string[]): Promise<void> => {
    for (const pattern of patterns) {
      const keys = await this.client.KEYS(pattern)
      if (keys.length) {
        await this.client.DEL(keys)
      }
    }
    // deleting common keys created by typeorm
    // await this.client.DEL('resultsNamespace:*')
    // await this.client.DEL('User*')
  }
}
