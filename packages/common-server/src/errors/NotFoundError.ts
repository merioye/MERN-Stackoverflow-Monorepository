import { CustomError, SerializedError } from './CustomError'

export class NotFoundError extends CustomError {
  statusCode = 404

  constructor(message?: string) {
    super(message ? message : 'Not Found')
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }

  serializeErrors = (): SerializedError[] => {
    return [{ message: this.message }]
  }
}
