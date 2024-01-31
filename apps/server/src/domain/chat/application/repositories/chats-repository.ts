import { WAEntityID } from '@/core/entities/wa-entity-id'
import { PaginationParams } from '@/domain/shared/application/repositories/pagination-params'
import { Chat } from '../../enterprise/types/chat'

export interface ChatsRepositoryFilters {
  deleted?: boolean
}

export interface ChatsRepositoryFindManyByWhatsAppIdParams
  extends PaginationParams,
    ChatsRepositoryFilters {
  whatsAppId: string
}

export interface ChatsRepositoryCountManyByWhatsAppIdParams
  extends ChatsRepositoryFilters {
  whatsAppId: string
}

export interface ChatsRepositoryFindByWAChatIdAndWhatsAppIdParams {
  whatsAppId: string
  waChatId: WAEntityID
}

export interface ChatsRepositoryFindManyByWAChatsIdsParams {
  waChatsIds: WAEntityID[]
}

export abstract class ChatsRepository {
  abstract findManyByWhatsAppId(
    params: ChatsRepositoryFindManyByWhatsAppIdParams,
  ): Promise<Chat[]>

  abstract countManyByWhatsAppId(
    params: ChatsRepositoryCountManyByWhatsAppIdParams,
  ): Promise<number>

  abstract findByWAChatIdAndWhatsAppId(
    params: ChatsRepositoryFindByWAChatIdAndWhatsAppIdParams,
  ): Promise<Chat | null>

  abstract findManyByWAChatsIds(
    params: ChatsRepositoryFindManyByWAChatsIdsParams,
  ): Promise<Chat[]>

  abstract save(chat: Chat): Promise<void>

  abstract softDelete(chat: Chat): Promise<void>

  abstract create(chat: Chat): Promise<void>

  abstract createMany(chats: Chat[]): Promise<void>
}
