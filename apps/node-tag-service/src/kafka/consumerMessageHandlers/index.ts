import {
  ForbiddenError,
  NotFoundError,
  UserCreatedData,
  UserUpdatedData,
} from 'stackoverflow-server-common'
import { userService } from '../../services'

// ############################ User created handler #######################

export const handleUserCreated = async (data: UserCreatedData): Promise<void> => {
  const { id } = data

  const alreadyExists = await userService.findOnly({ _id: id })
  if (alreadyExists) {
    throw new ForbiddenError()
  }

  await userService.create(data)
}

// ############################ User updated handler #######################

export const handleUserUpdated = async (data: UserUpdatedData): Promise<void> => {
  const { updatedAt } = data

  const user = await userService.findOnlyByMessage(data)
  if (!user) {
    throw new NotFoundError('User not found')
  }

  user.set({ updatedAt })
  await user.save()
}
