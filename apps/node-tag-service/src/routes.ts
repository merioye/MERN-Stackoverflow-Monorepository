import { catchAsyncError } from 'stackoverflow-server-common'
import { Router } from 'express'
import { tagController } from './controllers'

const router = Router()

router.get('/healthcheck', (req, res) => {
  res.status(200).json({
    message: 'Server is up and running',
  })
})
router.post('/tags', catchAsyncError(tagController.createTag))
router.get('/tags', catchAsyncError(tagController.getTags))

export { router }
