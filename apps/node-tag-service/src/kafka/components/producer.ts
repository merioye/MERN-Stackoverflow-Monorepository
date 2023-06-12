import { KafkaProducer } from 'stackoverflow-server-common'
import { KafkaConfig } from 'kafkajs'
import { getEnvVars } from '../../config/constants'
import { logger } from '../../logger'
import { clientId } from '../config'

const { KAFKA_BROKERS_LIST } = getEnvVars()

const kafkaConfig: KafkaConfig = {
  clientId,
  brokers: KAFKA_BROKERS_LIST!,
}

export const producer = new KafkaProducer(kafkaConfig, logger)
