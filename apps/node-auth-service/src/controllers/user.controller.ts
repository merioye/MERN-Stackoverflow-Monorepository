import { Response } from 'express'
import {
  NotFoundError,
  CustomRequest,
  validatorService,
  BadRequestError,
  ForbiddenError,
  UserUpdatedData,
  UserUpdated,
  Topics,
} from 'stackoverflow-server-common'
import { userService } from '../services'
import { producer } from '../kafka'

class UserController {
  whoAmI = async (req: CustomRequest<{}>, res: Response) => {
    const user = await userService.findOnly({ _id: req.auth?.userId }, { password: 0 })
    res.status(200).json({
      user,
    })
  }

  getUsers = async (req: CustomRequest<{}>, res: Response) => {
    const [users, totalCount] = await userService.findMultiple(req)
    res.status(200).json({ users, totalCount })
  }

  getSingleUser = async (req: CustomRequest<{}>, res: Response) => {
    const { id } = req.params
    const isValid = validatorService.isValidObjectId(id)
    if (!isValid) {
      throw new BadRequestError('Please provide a valid id')
    }

    const user = await userService.findOnly({ _id: id }, { password: 0 })
    if (!user) {
      throw new NotFoundError('User not found with provided id')
    }

    res.status(200).json({
      user,
    })
  }

  updateProfileViews = async (req: CustomRequest<{}>, res: Response) => {
    const userId = req.auth?.userId as string
    const id = req.params.id
    const isValid = validatorService.isValidObjectId(id)
    if (!isValid) {
      throw new BadRequestError('Please provide a valid id')
    }

    const alreadyViewed = await userService.findOnly({
      _id: id,
      profileViews: { $elemMatch: { $eq: userId } },
    })
    if (alreadyViewed) {
      return res
        .status(200)
        .json({ message: 'Profile views updated successfully', newAdded: false })
    }

    const userProfile = await userService.findOnly({ _id: id })
    if (!userProfile) {
      throw new NotFoundError('User Profile not found')
    }
    if (userProfile.id === userId) {
      return res
        .status(200)
        .json({ message: 'Profile views updated successfully', newAdded: false })
    }

    const user = await userService.findOnly({ _id: userId })
    if (!user) {
      throw new ForbiddenError()
    }

    const updatedUser = await userService.updateSingle(
      { _id: id },
      { $addToSet: { profileViews: userId } },
    )

    const message: UserUpdatedData = {
      id: updatedUser?.id,
      newViewerId: userId,
      updatedAt: updatedUser!.updatedAt,
      version: updatedUser!.version,
    }
    await producer.produce<UserUpdated>(Topics.UserUpdated, message)

    res.status(200).json({ message: 'Profile views updated successfully', newAdded: true })
  }
}

export const userController = new UserController()
