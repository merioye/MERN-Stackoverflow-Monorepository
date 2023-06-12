import { KafkaConsumer } from 'stackoverflow-server-common'
import { KafkaConfig } from 'kafkajs'
import { getEnvVars } from '../../config/constants'
import { logger } from '../../logger'
import { groupId } from '../config/groupId'
import { clientId } from '../config'

const { KAFKA_BROKERS_LIST } = getEnvVars()

const kafkaConfig: KafkaConfig = {
  clientId,
  brokers: KAFKA_BROKERS_LIST!,
}

export const consumer = new KafkaConsumer(kafkaConfig, groupId, logger)
