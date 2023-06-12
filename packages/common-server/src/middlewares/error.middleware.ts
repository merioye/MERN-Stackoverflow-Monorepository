import { NextFunction, Request, Response } from 'express'
import { CustomError, SerializedError } from '../errors/CustomError'

interface ErrorResponse {
  errors: SerializedError[]
}

export const errorHandlerMiddleware = (
  err: Error,
  req: Request, // eslint-disable-line
  res: Response,
  next: NextFunction, //eslint-disable-line
): Response<ErrorResponse> => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      errors: err.serializeErrors(),
    })
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      errors: [{ message: 'Invalid token...' }],
    })
  }

  return res.status(500).json({
    errors: [{ message: 'Oops! Something went wrong' }],
  })
}
