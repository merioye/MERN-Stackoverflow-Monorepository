import { consumer } from '../components/consumer'
import { producer } from '../components/producer'

export const disconnectFromKafka = async (): Promise<void> => {
  await consumer.disconnect()
  await producer.disconnect()
}
