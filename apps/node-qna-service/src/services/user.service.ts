import { FindOptionsWhere } from 'typeorm'
import { User } from '../entities'
import { UserRepository } from '../repositories'
import { UserCreatedData, UserUpdatedData } from 'stackoverflow-server-common'

class UserService {
  findOnlyBy = async (filter: FindOptionsWhere<User>): Promise<User | null> => {
    return await UserRepository.findOneBy(filter)
  }

  findOnly = async (filter: FindOptionsWhere<User>): Promise<User | null> => {
    return await UserRepository.findOne({ where: filter })
  }

  findOnlyByMessage = async (message: UserUpdatedData): Promise<User | null> => {
    return await UserRepository.findByMessage(message)
  }

  create = async (data: UserCreatedData): Promise<User> => {
    const { id, username, avatar, createdAt, updatedAt } = data
    const user = new User()
    user.id = id
    user.username = username
    user.avatar = avatar
    user.createdAt = createdAt
    user.updatedAt = updatedAt
    await UserRepository.save(user)

    return user
  }
}

export const userService = new UserService()
