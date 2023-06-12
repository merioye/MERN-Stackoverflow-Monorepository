import { ValidationOptions } from 'joi'

export const joiValidationOptions: ValidationOptions = {
  errors: { wrap: { label: false } },
  abortEarly: false,
}
