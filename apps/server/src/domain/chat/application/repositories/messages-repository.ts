import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WAEntityID } from '@/core/entities/wa-entity-id'
import { WAMessageID } from '@/core/entities/wa-message-id'
import { PaginationParams } from '@/domain/shared/application/repositories/pagination-params'
import { EitherMessage } from '../../enterprise/entities/either-message'

export interface MessagesRepositoryFindByIdParams {
  id: string
}

export interface MessagesRepositoryFindManyByChatIdParams
  extends PaginationParams {
  chatId: string
}

export interface MessagesRepositoryCountManyByChatIdParams {
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

export interface MessagesRepositoryGetMessagesIdsByChatIdParams {
  chatId: string
}

export abstract class MessagesRepository {
  abstract findById(
    params: MessagesRepositoryFindByIdParams,
  ): Promise<EitherMessage | null>

  abstract findManyByChatId(
    params: MessagesRepositoryFindManyByChatIdParams,
  ): Promise<EitherMessage[]>

  abstract countManyByChatId(
    params: MessagesRepositoryCountManyByChatIdParams,
  ): Promise<number>

  abstract findByWAMessageId(
    params: MessagesRepositoryFindByWAMessageIdParams,
  ): Promise<EitherMessage | null>

  abstract findManyByWAMessagesIds(
    params: MessagesRepositoryFindManyByWAMessagesIdsParams,
  ): Promise<EitherMessage[]>

  abstract findToRevoke(
    params: MessagesRepositoryFindToRevokeParams,
  ): Promise<EitherMessage | null>

  abstract save(message: EitherMessage): Promise<void>

  abstract deleteManyByChatId(
    params: MessagesRepositoryDeleteManyByChatIdParams,
  ): Promise<void>

  abstract create(message: EitherMessage): Promise<void>

  abstract getMessagesIdsByChatId(
    params: MessagesRepositoryGetMessagesIdsByChatIdParams,
  ): Promise<UniqueEntityID[]>
}
