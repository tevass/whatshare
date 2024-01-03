import { WAEntityID } from '@/core/entities/wa-entity-id'
import { WAMessageID } from '@/core/entities/wa-message-id'
import { Message } from '../../enterprise/entities/message'

export interface FindToRevokeParams {
  createdAt: Date
  waChatId: WAEntityID
  whatsAppId: string
}

export abstract class MessagesRepository {
  abstract findById(id: string): Promise<Message | null>

  abstract findManyByChatId(chatId: string): Promise<Message[]>

  abstract findByWAMessageId(waMessageId: WAMessageID): Promise<Message | null>

  abstract findToRevoke(params: FindToRevokeParams): Promise<Message | null>

  abstract save(message: Message): Promise<void>

  abstract saveMany(messages: Message[]): Promise<void>

  abstract create(message: Message): Promise<void>
}
