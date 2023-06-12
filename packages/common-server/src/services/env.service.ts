export class EnvService<T extends object> {
  private envVars

  constructor(envVars: T) {
    this.envVars = envVars
  }

  requireEnvVars = (): void => {
    const keys = Object.keys(this.envVars)
    for (const key of keys) {
      if (this.envVars[key as keyof T] === undefined) {
        throw new Error(`${key} is not defined`)
      }
    }
  }
}
