import { ExpressJwtOptions, expressJwtSecret, GetVerificationKey } from 'jwks-rsa'
import { Params } from 'express-jwt'
import { CustomRequest } from 'stackoverflow-server-common'
import { rateLimit } from 'express-rate-limit'
import { CorsOptions } from 'cors'
import { getEnvVars } from './constants'

const { JWKS_URI, NODE_ENV, TESTING_JWT_SECRET } = getEnvVars()

const jwksRsaOptions: ExpressJwtOptions = {
  jwksUri: JWKS_URI!,
  rateLimit: true,
  cache: true,
}

export const expressJwtOptions: Params = {
  secret:
    NODE_ENV === 'test'
      ? TESTING_JWT_SECRET!
      : (expressJwtSecret(jwksRsaOptions) as GetVerificationKey),
  algorithms: NODE_ENV === 'test' ? ['HS256'] : ['RS256'],
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
  { url: '/api/tag/v1/healthcheck', methods: ['GET'] },
  { url: '/api/tag/v1/tags', methods: ['GET'] },
]
