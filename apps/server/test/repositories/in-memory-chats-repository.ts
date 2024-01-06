import {
  ChatsRepository,
  CountManyByWhatsAppIdParams,
  FindByWAChatIdAndWhatsAppIdParams,
  FindByWAChatIdParams,
  FindManyByWAChatsIdsParams,
  FindManyByWhatsAppIdParams,
} from '@/domain/chat/application/repositories/chats-repository'
import { Chat } from '@/domain/chat/enterprise/entities/chat'
import { Pagination } from '@/domain/chat/enterprise/utilities/pagination'
import { BaseInMemory } from './base-in-memory'

export class InMemoryChatsRepository
  extends BaseInMemory<Chat>
  implements ChatsRepository
{
  async findByWAChatId(params: FindByWAChatIdParams): Promise<Chat | null> {
    const { waChatId, includeDeleted = false } = params

    const chat = this.items.find(
      (item) =>
        item.waChatId.equals(waChatId) &&
        (includeDeleted ? true : !item.isDeleted()),
    )

    if (!chat) return null

    return chat
  }

  async findManyByWhatsAppId(
    params: FindManyByWhatsAppIdParams,
  ): Promise<Chat[]> {
    const { whatsAppId, page, take, includeDeleted = false } = params

    return this.items
      .filter(
        (item) =>
          item.whatsAppId.toString() === whatsAppId &&
          (includeDeleted ? true : !item.isDeleted()),
      )
      .slice(Pagination.skip({ limit: take, page }), page * take)
  }

  async countManyByWhatsAppId(
    params: CountManyByWhatsAppIdParams,
  ): Promise<number> {
    const { whatsAppId, includeDeleted = false } = params

    return this.items.filter(
      (item) =>
        item.whatsAppId.toString() === whatsAppId &&
        (includeDeleted ? true : !item.isDeleted()),
    ).length
  }

  async findByWAChatIdAndWhatsAppId(
    params: FindByWAChatIdAndWhatsAppIdParams,
  ): Promise<Chat | null> {
    const { waChatId, whatsAppId, includeDeleted = false } = params

    const chat = this.items.find(
      (item) =>
        item.whatsAppId.toString() === whatsAppId &&
        item.waChatId.equals(waChatId) &&
        (includeDeleted ? true : !item.isDeleted()),
    )

    if (!chat) return null

    return chat
  }

  async findManyByWAChatsIds(
    params: FindManyByWAChatsIdsParams,
  ): Promise<Chat[]> {
    const { waChatsIds, includeDeleted = false } = params

    return this.items.filter(
      (item) =>
        waChatsIds.includes(item.waChatId) &&
        (includeDeleted ? true : !item.isDeleted()),
    )
  }
}
