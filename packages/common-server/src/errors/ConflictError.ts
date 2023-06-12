import { CustomError, SerializedError } from './CustomError'

export class ConflictError extends CustomError {
  statusCode = 409

  constructor(message: string) {
    super(message)
    Object.setPrototypeOf(this, ConflictError.prototype)
  }

  serializeErrors(): SerializedError[] {
    return [{ message: this.message }]
  }
}
