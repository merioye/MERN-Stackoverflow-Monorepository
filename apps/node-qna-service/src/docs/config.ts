import swaggerUI from 'swagger-ui-express'
import path from 'path'
import YAML from 'yamljs'

const swaggerJSDocs = YAML.load(path.resolve(__dirname, './swagger.yaml'))

export const swaggerConfig = {
  serve: swaggerUI.serve,
  setup: swaggerUI.setup(swaggerJSDocs),
}
