import express, { Request, Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import { expressjwt } from 'express-jwt'
import cookieParser from 'cookie-parser'
import { NotFoundError, errorHandlerMiddleware } from 'stackoverflow-server-common'
import { router } from './routes'
import { limiter, corsOptions, expressJwtOptions, publicRoutes } from './config/middlewaresOptions'
import { swaggerConfig } from './docs/config'

const app = express()

app.use(helmet())
app.use(compression())
app.use(limiter)
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())
app.use('/api/auth/v1/api-docs', swaggerConfig.serve, swaggerConfig.setup)
app.use(expressjwt(expressJwtOptions).unless({ path: publicRoutes }))
app.use('/api/auth/v1', router)
app.use('/api/auth/v1', express.static('public'))

// eslint-disable-next-line
app.all('*', (req: Request, res: Response): never => {
  throw new NotFoundError()
})
app.use(errorHandlerMiddleware)

export { app }
