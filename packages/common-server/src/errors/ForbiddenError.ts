import { CustomError, SerializedError } from './CustomError'

export class ForbiddenError extends CustomError {
  statusCode = 403

  constructor() {
    super('Action Forbidden')
    Object.setPrototypeOf(this, ForbiddenError.prototype)
  }

  serializeErrors(): SerializedError[] {
    return [{ message: 'Action Forbidden' }]
  }
}
