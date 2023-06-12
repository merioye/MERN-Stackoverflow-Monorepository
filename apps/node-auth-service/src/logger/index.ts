import { Logger } from 'winston'

import buildDevLogger from './logger.dev'
import buildProdLogger from './logger.prod'
import { getEnvVars } from '../config/constants'

const { NODE_ENV } = getEnvVars()

let logger: Logger
if (NODE_ENV !== 'production') {
  logger = buildDevLogger()
} else {
  logger = buildProdLogger()
}

export { logger }
