import { format, createLogger, transports } from 'winston'
import path from 'path'

const { timestamp, combine, errors, json } = format

function buildProdLogger() {
  return createLogger({
    level: 'info',
    format: combine(timestamp(), errors({ stack: true }), json()),
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

export default buildProdLogger
