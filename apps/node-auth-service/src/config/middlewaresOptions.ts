import { Params } from 'express-jwt'
import { CustomRequest } from 'stackoverflow-server-common'
import { rateLimit } from 'express-rate-limit'
import { CorsOptions } from 'cors'
import { tokenService } from '../services'
import { getEnvVars } from './constants'

const { ACCESS_TOKEN_PUBLIC_KEY } = getEnvVars()

const accessTokenPublicKey = tokenService.getRsaTokenKey(ACCESS_TOKEN_PUBLIC_KEY!, 'access_public')
export const expressJwtOptions: Params = {
  secret: accessTokenPublicKey,
  algorithms: ['RS256'],
  getToken: (req: CustomRequest<{}>) => req.cookies.accessToken,
}

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
})

const whitelist = '*'
export const corsOptions: CorsOptions = {
  origin: whitelist,
  credentials: true,
}

export const publicRoutes = [
  '/api/auth/v1/healthcheck',
  '/api/auth/v1/register',
  '/api/auth/v1/login',
  '/api/auth/v1/users',
  '/api/auth/v1/refreshToken',
  '/api/auth/v1/jwks.json',
  { url: /^\/api\/auth\/v1\/users\/.*/, methods: ['GET'] },
]
