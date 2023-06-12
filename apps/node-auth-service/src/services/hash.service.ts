import bcrypt from 'bcryptjs'
import { getEnvVars } from '../config/constants'

const { HASH_SALT_ROUNDS } = getEnvVars()

class HashService {
  toHash = async (str: string): Promise<string> => {
    const salt = await bcrypt.genSalt(Number(HASH_SALT_ROUNDS))
    return await bcrypt.hash(str, salt)
  }

  toCompare = async (str: string, hashedStr: string): Promise<boolean> => {
    return await bcrypt.compare(str, hashedStr)
  }
}

export const hashService = new HashService()
