import { FindOptionsWhere } from 'typeorm'
import {
  BadRequestError,
  ForbiddenError,
  TagCreatedData,
  validatorService,
} from 'stackoverflow-server-common'
import { TagRepository } from '../repositories'
import { Tag } from '../entities'

class TagService {
  findOnlyBy = async (filter: FindOptionsWhere<Tag>): Promise<Tag | null> => {
    return await TagRepository.findOneBy(filter)
  }

  create = async (data: TagCreatedData): Promise<Tag> => {
    const { id, name, createdAt, updatedAt } = data

    const tag = new Tag()
    tag.id = id
    tag.name = name
    tag.createdAt = createdAt
    tag.updatedAt = updatedAt
    await TagRepository.save(tag)

    return tag
  }

  validateAndfindTagsBy = async (tagsIds: string[]): Promise<Tag[]> => {
    const tags: Tag[] = []
    for (const tagId of tagsIds) {
      const isValid = validatorService.isValidObjectId(tagId)
      if (!isValid) {
        throw new BadRequestError('All tagsIds must be valid')
      }

      const tag = await TagRepository.findOneBy({ id: tagId })
      if (!tag) {
        throw new ForbiddenError()
      }
      tags.push(tag)
    }
    return tags
  }
}

export const tagService = new TagService()
