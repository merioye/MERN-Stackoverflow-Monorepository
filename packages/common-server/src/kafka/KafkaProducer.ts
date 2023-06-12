import { Kafka, KafkaConfig, Partitioners, Producer } from 'kafkajs'
import { Logger } from 'winston'
import { Event } from '../types'

export class KafkaProducer {
  private readonly kafka: Kafka
  private readonly producer: Producer
  private readonly logger: Logger
  private isConnected = false

  constructor(kafkaConfig: KafkaConfig, logger: Logger) {
    this.kafka = new Kafka(kafkaConfig)
    this.producer = this.kafka.producer({
      allowAutoTopicCreation: true,
      createPartitioner: Partitioners.LegacyPartitioner,
    })
    this.logger = logger
  }

  produce = async <T extends Event>(topic: T['topic'], message: T['data']): Promise<void> => {
    if (!this.isConnected) {
      await this.connect()
    }
    const value = JSON.stringify(message)
    await this.producer.send({ topic, messages: [{ value }] })
    this.logger.info(`Message sent to Kafka-topic: ${topic}`, value)
  }

  connect = async (): Promise<void> => {
    try {
      await this.producer.connect()
      this.isConnected = true
    } catch (err) {
      this.logger.error('Failed to connect to kafka-producer: ', err)
    }
  }

  disconnect = async (): Promise<void> => {
    try {
      await this.producer.disconnect()
      this.isConnected = false
    } catch (err) {
      this.logger.error('Error while disconnecting from kafka-producer: ', err)
    }
  }
}
