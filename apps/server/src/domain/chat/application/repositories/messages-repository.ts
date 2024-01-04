import { WAEntityID } from '@/core/entities/wa-entity-id'
import { WAMessageID } from '@/core/entities/wa-message-id'
import { PaginationParams } from '@/domain/shared/application/repositories/pagination-params'
import { Message } from '../../enterprise/entities/message'

export interface FindToRevokeParams {
  createdAt: Date
  waChatId: WAEntityID
  whatsAppId: string
}

export interface FindManyByChatIdParams extends PaginationParams {
  chatId: string
}

export interface CountManyByChatIdParams {
  chatId: string
}

export abstract class MessagesRepository {
  abstract findById(id: string): Promise<Message | null>

  abstract findManyByChatId(params: FindManyByChatIdParams): Promise<Message[]>

  abstract countManyByChatId(params: CountManyByChatIdParams): Promise<number>

  abstract findAllByChatId(chatId: string): Promise<Message[]>

  abstract findByWAMessageId(
    waMessageId: WAMessageID,
    includeDeleted?: boolean,
  ): Promise<Message | null>

  abstract findToRevoke(
    params: FindToRevokeParams,
    includeDeleted?: boolean,
  ): Promise<Message | null>

  abstract save(message: Message): Promise<void>

  abstract saveMany(messages: Message[]): Promise<void>

  abstract create(message: Message): Promise<void>
}
