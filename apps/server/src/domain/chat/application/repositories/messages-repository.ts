import { WAEntityID } from '@/core/entities/wa-entity-id'
import { WAMessageID } from '@/core/entities/wa-message-id'
import { PaginationParams } from '@/domain/shared/application/repositories/pagination-params'
import { Message } from '../../enterprise/entities/message'

export interface MessagesRepositoryFilters {
  deleted?: boolean
}

export interface MessagesRepositoryFindByIdParams {
  id: string
}

export interface MessagesRepositoryFindManyByChatIdParams
  extends PaginationParams,
    MessagesRepositoryFilters {
  chatId: string
}

export interface MessagesRepositoryCountManyByChatIdParams
  extends MessagesRepositoryFilters {
  chatId: string
}

export interface MessagesRepositoryFindByWAMessageIdParams {
  waMessageId: WAMessageID
}

export interface MessagesRepositoryFindManyByWAMessagesIdsParams {
  waMessagesIds: WAMessageID[]
}

export interface MessagesRepositoryFindToRevokeParams {
  createdAt: Date
  waChatId: WAEntityID
  whatsAppId: string
}

export interface MessagesRepositoryDeleteManyByChatIdParams {
  chatId: string
}

export abstract class MessagesRepository {
  abstract findById(
    params: MessagesRepositoryFindByIdParams,
  ): Promise<Message | null>

  abstract findManyByChatId(
    params: MessagesRepositoryFindManyByChatIdParams,
  ): Promise<Message[]>

  abstract countManyByChatId(
    params: MessagesRepositoryCountManyByChatIdParams,
  ): Promise<number>

  abstract findByWAMessageId(
    params: MessagesRepositoryFindByWAMessageIdParams,
  ): Promise<Message | null>

  abstract findManyByWAMessagesIds(
    params: MessagesRepositoryFindManyByWAMessagesIdsParams,
  ): Promise<Message[]>

  abstract findToRevoke(
    params: MessagesRepositoryFindToRevokeParams,
  ): Promise<Message | null>

  abstract save(message: Message): Promise<void>

  abstract softDeleteManyByChatId(
    params: MessagesRepositoryDeleteManyByChatIdParams,
  ): Promise<void>

  abstract create(message: Message): Promise<void>
}
