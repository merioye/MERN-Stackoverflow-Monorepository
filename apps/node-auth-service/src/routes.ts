import { Router } from 'express'
import { catchAsyncError } from 'stackoverflow-server-common'

import { authController, userController } from './controllers'

const router = Router()

router.get('/healthcheck', (req, res) => {
  res.status(200).json({
    message: 'Server is up and running',
  })
})
router.post('/register', catchAsyncError(authController.register))
router.post('/login', catchAsyncError(authController.login))
router.post('/logout', catchAsyncError(authController.logout))
router.get('/refreshToken', catchAsyncError(authController.refreshToken))

router.get('/whoAmI', catchAsyncError(userController.whoAmI))
router.get('/users', catchAsyncError(userController.getUsers))
router.get('/users/:id', catchAsyncError(userController.getSingleUser))
router.patch('/users/:id/profileViews', catchAsyncError(userController.updateProfileViews))

export { router }
