import { Response } from 'express'
import { JwtService } from 'stackoverflow-server-common'
import fs from 'fs'
import path from 'path'
import { Secret } from 'jsonwebtoken'
import { getEnvVars } from '../config/constants'
import { RefreshTokenModel, RefreshTokenDoc } from '../models'

const {
  NODE_ENV,
  ACCESS_TOKEN_PRIVATE_KEY,
  REFRESH_TOKEN_PRIVATE_KEY,
  REFRESH_TOKEN_PUBLIC_KEY,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
  ACCESS_TOKEN_COOKIE_EXPIRY,
  REFRESH_TOKEN_COOKIE_EXPIRY,
} = getEnvVars()

interface Payload {
  userId: string
}

type TokenKeyType = 'access_public' | 'access_private' | 'refresh_public' | 'refresh_private'

class TokenService {
  getRsaTokenKey = (key: string, type: TokenKeyType): Secret => {
    return NODE_ENV === 'production'
      ? key
      : fs.readFileSync(path.resolve(process.cwd(), `./certs/${type}.pem`))
  }

  saveJwtTokens = async (payload: Payload, res: Response): Promise<void> => {
    const jwtService = new JwtService<Payload>()

    const accessTokenPrivateKey = this.getRsaTokenKey(ACCESS_TOKEN_PRIVATE_KEY!, 'access_private')
    const refreshTokenPrivateKey = this.getRsaTokenKey(
      REFRESH_TOKEN_PRIVATE_KEY!,
      'refresh_private',
    )

    const { accessToken, refreshToken } = jwtService.generateTokens(
      payload,
      { secret: accessTokenPrivateKey, expiresIn: ACCESS_TOKEN_EXPIRY!, algorithm: 'RS256' },
      { secret: refreshTokenPrivateKey, expiresIn: REFRESH_TOKEN_EXPIRY!, algorithm: 'RS256' },
    )

    await RefreshTokenModel.updateOne(
      { userId: payload.userId },
      { $set: { userId: payload.userId, token: refreshToken } },
      { upsert: true },
    )

    res.cookie('accessToken', accessToken, {
      expires: new Date(Date.now() + Number(ACCESS_TOKEN_COOKIE_EXPIRY)),
      sameSite: NODE_ENV === 'production' ? 'none' : 'lax',
      secure: NODE_ENV === 'production',
      httpOnly: true,
    })
    res.cookie('refreshToken', refreshToken, {
      expires: new Date(Date.now() + Number(REFRESH_TOKEN_COOKIE_EXPIRY)),
      sameSite: NODE_ENV === 'production' ? 'none' : 'lax',
      secure: NODE_ENV === 'production',
      httpOnly: true,
    })
  }

  removeJwtTokens = async (userId: string, res: Response): Promise<void> => {
    await RefreshTokenModel.deleteOne({ userId })
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')
  }

  verifyRefreshToken = (token: string): Payload | null => {
    const jwtService = new JwtService<Payload>()
    const refreshTokenPublicKey = this.getRsaTokenKey(REFRESH_TOKEN_PUBLIC_KEY!, 'refresh_public')
    return jwtService.verifyToken(token, refreshTokenPublicKey)
  }

  findRefreshToken = async (token: string, userId: string): Promise<RefreshTokenDoc | null> => {
    return await RefreshTokenModel.findOne({ token, userId })
  }
}

export const tokenService = new TokenService()
