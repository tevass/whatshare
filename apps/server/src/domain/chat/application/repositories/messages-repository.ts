import { WAEntityID } from '@/core/entities/wa-entity-id'
import { WAMessageID } from '@/core/entities/wa-message-id'
import { PaginationParams } from '@/domain/shared/application/repositories/pagination-params'
import { Message } from '../../enterprise/entities/message'

interface MessagesRepositoryMethodsParams {
  includeDeleted?: boolean
}

export interface FindByIdParams extends MessagesRepositoryMethodsParams {
  id: string
}

export interface FindManyByChatIdParams
  extends MessagesRepositoryMethodsParams,
    PaginationParams {
  chatId: string
}

export interface CountManyByChatIdParams
  extends MessagesRepositoryMethodsParams {
  chatId: string
}

export interface FindAllByChatIdParams extends MessagesRepositoryMethodsParams {
  chatId: string
}

export interface FindByWAMessageIdParams
  extends MessagesRepositoryMethodsParams {
  waMessageId: WAMessageID
}

export interface FindManyByWAMessagesIdsParams
  extends MessagesRepositoryMethodsParams {
  waMessagesIds: WAMessageID[]
}

export interface FindToRevokeParams extends MessagesRepositoryMethodsParams {
  createdAt: Date
  waChatId: WAEntityID
  whatsAppId: string
}

export abstract class MessagesRepository {
  abstract findById(params: FindByIdParams): Promise<Message | null>

  abstract findManyByChatId(params: FindManyByChatIdParams): Promise<Message[]>

  abstract countManyByChatId(params: CountManyByChatIdParams): Promise<number>

  abstract findAllByChatId(params: FindAllByChatIdParams): Promise<Message[]>

  abstract findByWAMessageId(
    params: FindByWAMessageIdParams,
  ): Promise<Message | null>

  abstract findManyByWAMessagesIds(
    params: FindManyByWAMessagesIdsParams,
  ): Promise<Message[]>

  abstract findToRevoke(params: FindToRevokeParams): Promise<Message | null>

  abstract save(message: Message): Promise<void>

  abstract saveMany(messages: Message[]): Promise<void>

  abstract create(message: Message): Promise<void>
}
