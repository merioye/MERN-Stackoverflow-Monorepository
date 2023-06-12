import { ProjectionType, UpdateQuery } from 'mongoose'
import { clearCachedResultsForModel } from 'speedgoose'
import { CustomRequest, UrlQuery, MongoSortOrder } from 'stackoverflow-server-common'
import { UserAttrs, UserDoc, UserModel } from '../models'
import { UserRecordService } from './userRecord.service'

class UserService {
  findOnly = async (
    filter: Partial<Record<keyof UserDoc, any>>,
    projection: ProjectionType<UserDoc> = {},
  ): Promise<UserDoc | null> => {
    return await UserModel.findOne(filter, projection).cacheQuery()
  }

  create = async (user: UserAttrs): Promise<UserDoc> => {
    const newUser = UserModel.build(user)
    await newUser.save()
    await clearCachedResultsForModel('User')
    return newUser
  }

  findMultiple = async (req: CustomRequest<{}>): Promise<[UserDoc[], number]> => {
    const { username } = req.query
    const filter = username ? { username: { $regex: username, $options: 'i' } } : {}

    const query = req.query as UrlQuery
    const userRecordService = new UserRecordService<MongoSortOrder>(query)
    const sortBy = userRecordService.getSortOption()
    const { skip, take } = userRecordService.buildPagination()

    const users = await UserModel.find(filter, { password: 0 })
      .sort(sortBy)
      .skip(skip)
      .limit(take)
      .cacheQuery()

    let totalUsers = await UserModel.countDocuments().cacheQuery()
    if (!totalUsers) {
      totalUsers = 0
    }

    return [users, totalUsers]
  }

  updateSingle = async (
    filter: Partial<Record<keyof UserDoc, any>>,
    update: UpdateQuery<UserDoc>,
  ) => {
    const updatedUser = await UserModel.findOneAndUpdate(filter, update, { new: true })
    await updatedUser!.save()
    await clearCachedResultsForModel('User')
    return updatedUser
  }
}

export const userService = new UserService()
