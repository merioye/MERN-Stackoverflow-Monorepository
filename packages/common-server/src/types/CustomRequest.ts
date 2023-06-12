import { Request } from 'express'
import { JwtPayload } from 'jsonwebtoken'

interface ExpressJwtPayload extends JwtPayload {
  userId: string
}

interface Cookies {
  accessToken?: string
  refreshToken?: string
}

export interface CustomRequest<T> extends Request {
  auth?: ExpressJwtPayload
  body: T
  cookies: Cookies
}
