import { UserCreatedData, UserUpdatedData } from 'stackoverflow-server-common'
import { UserDoc, UserModel } from '../models'

class UserService {
  findOnly = async (filter: Partial<Record<keyof UserDoc, any>>): Promise<UserDoc | null> => {
    return await UserModel.findOne(filter)
  }

  findOnlyByMessage = async (message: UserUpdatedData): Promise<UserDoc | null> => {
    return await UserModel.findByMessage(message)
  }

  create = async (data: UserCreatedData): Promise<UserDoc> => {
    const { id, username, avatar, createdAt, updatedAt } = data

    const user = UserModel.build({
      _id: id,
      username,
      avatar,
      createdAt,
      updatedAt,
    })
    await user.save()

    return user
  }
}

export const userService = new UserService()
