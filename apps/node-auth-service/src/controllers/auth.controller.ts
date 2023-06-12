import { Response } from 'express'
import {
  ConflictError,
  NotAuthorizedError,
  NotFoundError,
  RequestValidationError,
  joiValidationOptions,
  CustomRequest,
  UserCreatedData,
  Topics,
  UserCreated,
} from 'stackoverflow-server-common'
import { loginValidator, registerValidator } from '../validations'
import { userService, hashService, tokenService } from '../services'
import { RegisterBody, LoginBody } from '../types'
import { producer } from '../kafka'

class AuthController {
  register = async (req: CustomRequest<RegisterBody>, res: Response) => {
    const { username, password } = req.body

    const { error } = registerValidator.validate(req.body, joiValidationOptions)
    if (error) {
      throw new RequestValidationError(error.details)
    }

    const existingUser = await userService.findOnly({ username })
    if (existingUser) {
      throw new ConflictError('User already exists')
    }

    const hashedPassword = await hashService.toHash(password)
    req.body.password = hashedPassword

    const user = await userService.create(req.body)

    const message: UserCreatedData = {
      id: user.id,
      username: user.username,
      avatar: user.avatar,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      version: user.version,
    }
    await producer.produce<UserCreated>(Topics.UserCreated, message)

    res.status(201).json({
      message: 'Registration successfull',
    })
  }

  login = async (req: CustomRequest<LoginBody>, res: Response) => {
    const { username, password } = req.body
    const { error } = loginValidator.validate(req.body, joiValidationOptions)
    if (error) {
      throw new RequestValidationError(error.details)
    }

    const user = await userService.findOnly({ username })
    if (!user) {
      throw new NotFoundError('Invalid credentials')
    }

    const isMatched = await hashService.toCompare(password, user.password)
    if (!isMatched) {
      throw new NotFoundError('Invalid credentials')
    }

    await tokenService.saveJwtTokens({ userId: user.id }, res)

    res.status(200).json({
      message: 'Login successfull',
    })
  }

  logout = async (req: CustomRequest<{}>, res: Response) => {
    const userId = req.auth?.userId as string
    await tokenService.removeJwtTokens(userId, res)
    res.status(200).json({
      message: 'Logout successfull',
    })
  }

  refreshToken = async (req: CustomRequest<{}>, res: Response) => {
    const { refreshToken } = req.cookies
    if (!refreshToken) {
      throw new NotAuthorizedError()
    }

    const isValid = tokenService.verifyRefreshToken(refreshToken)
    if (!isValid) {
      throw new NotAuthorizedError()
    }

    const user = await userService.findOnly({ _id: isValid.userId })
    if (!user) {
      throw new NotAuthorizedError()
    }

    const token = await tokenService.findRefreshToken(refreshToken, isValid.userId)
    if (!token) {
      throw new NotAuthorizedError()
    }

    await tokenService.saveJwtTokens({ userId: isValid.userId }, res)

    res.status(200).json({
      message: 'Tokens have been re-issued',
    })
  }
}

export const authController = new AuthController()
