import {
  ForbiddenError,
  NotFoundError,
  TagCreatedData,
  UserCreatedData,
  UserUpdatedData,
} from 'stackoverflow-server-common'
import { tagService, userService } from '../../services'
import { UserRepository } from '../../repositories'

// ############################ User created handler #######################

export const handleUserCreated = async (data: UserCreatedData): Promise<void> => {
  const { id } = data

  const alreadyExists = await userService.findOnlyBy({ id })
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
  user.updatedAt = updatedAt
  await UserRepository.save(user)
}

// ############################ Tag created handler #######################

export const handleTagCreated = async (data: TagCreatedData): Promise<void> => {
  const { id } = data

  const alreadyExists = await tagService.findOnlyBy({ id })
  if (alreadyExists) {
    throw new ForbiddenError()
  }

  await tagService.create(data)
}
