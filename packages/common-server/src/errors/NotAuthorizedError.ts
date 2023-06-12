import { CustomError, SerializedError } from './CustomError'

export class NotAuthorizedError extends CustomError {
  statusCode = 401

  constructor() {
    super('Not Authorized')
    Object.setPrototypeOf(this, NotAuthorizedError.prototype)
  }

  serializeErrors(): SerializedError[] {
    return [{ message: 'Not Authorized' }]
  }
}
