import { CustomError, SerializedError } from './CustomError'

export class InternalServerError extends CustomError {
  statusCode = 500

  constructor() {
    super('Oops! Something went wrong')
    Object.setPrototypeOf(this, InternalServerError.prototype)
  }

  serializeErrors(): SerializedError[] {
    return [{ message: 'Oops! Something went wrong' }]
  }
}
