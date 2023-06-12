import { Consumer, Kafka, KafkaConfig } from 'kafkajs'
import { Logger } from 'winston'
import { Topics } from '../types'

type MessageHandlers = {
  [topic: string]: (data: any) => Promise<void> // eslint-disable-line
}

export class KafkaConsumer {
  private readonly kafka: Kafka
  private readonly consumer: Consumer
  private readonly logger: Logger
  private isConnected = false
  private isSubscribed = false

  constructor(kafkaConfig: KafkaConfig, groupId: string, logger: Logger) {
    this.kafka = new Kafka(kafkaConfig)
    this.consumer = this.kafka.consumer({
      groupId,
      allowAutoTopicCreation: true,
      heartbeatInterval: 10000,
      maxInFlightRequests: 1,
      sessionTimeout: 30000,
      maxWaitTimeInMs: 5000,
      retry: {
        maxRetryTime: 60000,
        initialRetryTime: 1000,
        retries: 10,
      },
    })
    this.logger = logger
  }

  consume = async (topics: Topics[], messageHandlers: MessageHandlers): Promise<void> => {
    if (!this.isConnected) {
      await this.connect()
    }
    if (!this.isSubscribed) {
      await this.subscribeToTopics(topics)
    }

    await this.consumer.run({
      autoCommit: false,
      eachMessage: async ({ message, topic, partition }) => {
        try {
          const messageValue = JSON.parse(message.value!.toString())
          this.logger.info(`Received message from Kafka-topic: ${topic}`, messageValue)

          const messageHandler = messageHandlers[topic as Topics]
          await messageHandler(messageValue)

          await this.consumer.commitOffsets([
            { topic, partition, offset: (Number(message.offset) + 1).toString() },
          ])
        } catch (err) {
          this.logger.error(`Error while consuming message from kafka-topic: ${topic}`, err)
        }
      },
    })
  }

  subscribeToTopics = async (topics: Topics[]): Promise<void> => {
    try {
      await this.consumer.subscribe({ topics, fromBeginning: true })
      this.isSubscribed = true
    } catch (err) {
      this.logger.error('Failed to subscribe to kafka topics: ', err)
    }
  }

  connect = async (): Promise<void> => {
    try {
      await this.consumer.connect()
      this.isConnected = true
    } catch (err) {
      this.logger.error('Failed to connect to kafka-consumer: ', err)
    }
  }

  disconnect = async (): Promise<void> => {
    try {
      await this.consumer.disconnect()
      this.isConnected = false
    } catch (err) {
      this.logger.error('Error while disconnecting from kafka-consumer: ', err)
    }
  }
}
