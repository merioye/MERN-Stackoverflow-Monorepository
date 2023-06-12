import { ValidationErrorItem } from 'joi'

import { CustomError, SerializedError } from './CustomError'

export class RequestValidationError extends CustomError {
  private errors: ValidationErrorItem[]
  statusCode = 400

  constructor(errors: ValidationErrorItem[]) {
    super('Bad Request')
    this.errors = errors
    Object.setPrototypeOf(this, RequestValidationError.prototype)
  }

  serializeErrors = (): SerializedError[] => {
    return this.errors.map((error: ValidationErrorItem): SerializedError => {
      return { message: error.message, field: error.path[0] as string }
    })
  }
}
