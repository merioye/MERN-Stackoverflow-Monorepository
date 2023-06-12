class ValidatorService {
  private uuidRegex = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
  private objectIdReges = /^[a-fA-F0-9]{24}$/

  isValidUUID = (str: string): boolean => {
    return this.uuidRegex.test(str)
  }

  isValidObjectId = (str: string): boolean => {
    return this.objectIdReges.test(str)
  }
}

export const validatorService = new ValidatorService()
