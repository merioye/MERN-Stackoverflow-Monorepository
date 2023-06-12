import jwt, { Secret, Algorithm } from 'jsonwebtoken'

interface Payload {
  userId: string
}

interface JwtOptions {
  expiresIn: string
  secret: Secret
  algorithm: Algorithm
}

interface JwtTokens {
  accessToken: string
  refreshToken: string
}

export class JwtService<T extends Payload> {
  generateTokens = (
    payload: T,
    accessTokenOptions: JwtOptions,
    refreshTokenOptions: JwtOptions,
  ): JwtTokens => {
    const accessToken = jwt.sign(payload, accessTokenOptions.secret, {
      expiresIn: accessTokenOptions.expiresIn,
      algorithm: refreshTokenOptions.algorithm,
    })
    const refreshToken = jwt.sign(payload, refreshTokenOptions.secret, {
      expiresIn: refreshTokenOptions.expiresIn,
      algorithm: refreshTokenOptions.algorithm,
    })

    return { accessToken, refreshToken }
  }

  verifyToken = (token: string, secret: Secret): T | null => {
    try {
      const payload = jwt.verify(token, secret) as T
      return payload
    } catch (e) {
      return null
    }
  }
}
