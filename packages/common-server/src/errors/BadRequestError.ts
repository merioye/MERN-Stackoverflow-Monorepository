import { CustomError, SerializedError } from './CustomError'

export class BadRequestError extends CustomError {
  statusCode = 400

  constructor(message?: string) {
    super(message ? message : 'Bad Request')
    Object.setPrototypeOf(this, BadRequestError.prototype)
  }

  serializeErrors = (): SerializedError[] => {
    return [{ message: this.message }]
  }
}
