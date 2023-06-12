import { format, createLogger, transports } from 'winston'
import path from 'path'

const { timestamp, combine, printf, errors } = format

function buildDevLogger() {
  const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`
  })

  return createLogger({
    level: 'info',
    format: combine(
      format.colorize(),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      errors({ stack: true }),
      logFormat,
    ),
    transports: [
      new transports.Console(),
      new transports.File({
        filename: path.join(__dirname, '../../logs/error.log'),
        level: 'error',
      }),
      new transports.File({ filename: path.join(__dirname, '../../logs/combined.log') }),
    ],
  })
}

export default buildDevLogger
