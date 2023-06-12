import { CustomRequest, MongoSortOrder, UrlQuery } from 'stackoverflow-server-common'
import { clearCachedResultsForModel } from 'speedgoose'
import { TagDoc, TagModel } from '../models'
import { CreateTagBody } from '../types'
import { TagRecordService } from './tagRecord.service'

class TagService {
  findOnly = async (filter: Partial<Record<keyof TagDoc, any>>): Promise<TagDoc | null> => {
    return await TagModel.findOne(filter)
  }

  create = async (body: CreateTagBody): Promise<TagDoc> => {
    const newTag = TagModel.build(body)
    await newTag.save()
    await clearCachedResultsForModel('Tag')
    return newTag
  }

  findMultiple = async (req: CustomRequest<{}>): Promise<[TagDoc[], number]> => {
    const { name } = req.query
    const filter = name ? { name: { $regex: name, $options: 'i' } } : {}

    const query = req.query as UrlQuery
    const tagRecordService = new TagRecordService<MongoSortOrder>(query)
    const sortBy = tagRecordService.getSortOption()
    const { skip, take } = tagRecordService.buildPagination()

    const tags = await TagModel.find(filter).sort(sortBy).skip(skip).limit(take).cacheQuery()
    let totalTags = await TagModel.countDocuments().cacheQuery()
    if (!totalTags) {
      totalTags = 0
    }

    return [tags, totalTags]
  }
}

export const tagService = new TagService()
