import { Response } from 'express'
import {
  CustomRequest,
  ForbiddenError,
  RequestValidationError,
  TagCreated,
  TagCreatedData,
  Topics,
  joiValidationOptions,
} from 'stackoverflow-server-common'
import { CreateTagBody } from '../types'
import { createTagValidator } from '../validations'
import { tagService, userService } from '../services'
import { producer } from '../kafka'

class TagController {
  createTag = async (req: CustomRequest<CreateTagBody>, res: Response) => {
    const userId = req.auth?.userId as string
    const { name } = req.body

    const { error } = createTagValidator.validate(req.body, joiValidationOptions)
    if (error) {
      throw new RequestValidationError(error.details)
    }

    const tag = await tagService.findOnly({ name })
    if (tag) {
      return res.status(200).json({ message: 'Tag already exists' })
    }

    const user = await userService.findOnly({ _id: userId })
    if (!user) {
      throw new ForbiddenError()
    }

    const newlyCreatedTag = await tagService.create(req.body)

    const message: TagCreatedData = {
      id: newlyCreatedTag.id,
      name: newlyCreatedTag.name,
      createdAt: newlyCreatedTag.createdAt,
      updatedAt: newlyCreatedTag.updatedAt,
      version: newlyCreatedTag.version,
    }
    await producer.produce<TagCreated>(Topics.TagCreated, message)

    res.status(201).json({
      tag: newlyCreatedTag,
    })
  }

  getTags = async (req: CustomRequest<{}>, res: Response) => {
    const [tags, totalCount] = await tagService.findMultiple(req)
    res.status(200).json({
      tags,
      totalCount,
    })
  }
}

export const tagController = new TagController()
