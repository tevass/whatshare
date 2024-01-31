import { WAEntityID } from '@/core/entities/wa-entity-id'
import { PaginationParams } from '@/domain/shared/application/repositories/pagination-params'
import { EitherChat } from '../../enterprise/entities/either-chat'

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
  ): Promise<EitherChat[]>

  abstract countManyByWhatsAppId(
    params: ChatsRepositoryCountManyByWhatsAppIdParams,
  ): Promise<number>

  abstract findByWAChatIdAndWhatsAppId(
    params: ChatsRepositoryFindByWAChatIdAndWhatsAppIdParams,
  ): Promise<EitherChat | null>

  abstract findManyByWAChatsIds(
    params: ChatsRepositoryFindManyByWAChatsIdsParams,
  ): Promise<EitherChat[]>

  abstract save(chat: EitherChat): Promise<void>

  abstract softDelete(chat: EitherChat): Promise<void>

  abstract create(chat: EitherChat): Promise<void>

  abstract createMany(chats: EitherChat[]): Promise<void>
}
