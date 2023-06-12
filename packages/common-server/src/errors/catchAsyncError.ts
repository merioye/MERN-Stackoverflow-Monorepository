import { Response, NextFunction, RequestHandler } from 'express'
import { CustomRequest } from '../types'

export const catchAsyncError = (passedFunction: RequestHandler) => {
  return (req: CustomRequest<{}>, res: Response, next: NextFunction): void => {
    Promise.resolve(passedFunction(req, res, next)).catch(next)
  }
}
