import { WAEntityID } from '@/core/entities/wa-entity-id'
import { PaginationParams } from '@/domain/shared/application/repositories/pagination-params'
import { Chat } from '../../enterprise/entities/chat'

interface ChatsRepositoryMethodsParams {
  includeDeleted?: boolean
}

export interface FindManyByWhatsAppIdParams
  extends ChatsRepositoryMethodsParams,
    PaginationParams {
  whatsAppId: string
}

export interface CountManyByWhatsAppIdParams
  extends ChatsRepositoryMethodsParams {
  whatsAppId: string
}

export interface FindByWAChatIdAndWhatsAppIdParams
  extends ChatsRepositoryMethodsParams {
  whatsAppId: string
  waChatId: WAEntityID
}

export interface FindManyByWAChatsIdsParams
  extends ChatsRepositoryMethodsParams {
  waChatsIds: WAEntityID[]
}

export abstract class ChatsRepository {
  abstract findManyByWhatsAppId(
    params: FindManyByWhatsAppIdParams,
  ): Promise<Chat[]>

  abstract countManyByWhatsAppId(
    params: CountManyByWhatsAppIdParams,
  ): Promise<number>

  abstract findByWAChatIdAndWhatsAppId(
    params: FindByWAChatIdAndWhatsAppIdParams,
  ): Promise<Chat | null>

  abstract findManyByWAChatsIds(
    params: FindManyByWAChatsIdsParams,
  ): Promise<Chat[]>

  abstract save(chat: Chat): Promise<void>

  abstract create(chat: Chat): Promise<void>

  abstract createMany(chats: Chat[]): Promise<void>
}
