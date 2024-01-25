import {
  ChatsRepository,
  CountManyByWhatsAppIdParams,
  FindByWAChatIdAndWhatsAppIdParams,
  FindManyByWAChatsIdsParams,
  FindManyByWhatsAppIdParams,
} from '@/domain/chat/application/repositories/chats-repository'
import { Chat } from '@/domain/chat/enterprise/entities/chat'
import { Pagination } from '@/domain/shared/enterprise/utilities/pagination'

export class InMemoryChatsRepository implements ChatsRepository {
  items: Chat[] = []

  async findManyByWhatsAppId(
    params: FindManyByWhatsAppIdParams,
  ): Promise<Chat[]> {
    const { whatsAppId, page, take, findDeleted = false } = params

    return this.items
      .filter(
        (item) =>
          item.whatsAppId.toString() === whatsAppId &&
          (findDeleted ? true : !item.isDeleted()),
      )
      .slice(Pagination.skip({ limit: take, page }), page * take)
  }

  async countManyByWhatsAppId(
    params: CountManyByWhatsAppIdParams,
  ): Promise<number> {
    const { whatsAppId, findDeleted = false } = params

    return this.items.filter(
      (item) =>
        item.whatsAppId.toString() === whatsAppId &&
        (findDeleted ? true : !item.isDeleted()),
    ).length
  }

  async findByWAChatIdAndWhatsAppId(
    params: FindByWAChatIdAndWhatsAppIdParams,
  ): Promise<Chat | null> {
    const { waChatId, whatsAppId, findDeleted = false } = params

    const chat = this.items.find(
      (item) =>
        item.whatsAppId.toString() === whatsAppId &&
        item.waChatId.equals(waChatId) &&
        (findDeleted ? true : !item.isDeleted()),
    )

    if (!chat) return null

    return chat
  }

  async findManyByWAChatsIds(
    params: FindManyByWAChatsIdsParams,
  ): Promise<Chat[]> {
    const { waChatsIds, findDeleted = false } = params

    return this.items.filter(
      (item) =>
        waChatsIds.includes(item.waChatId) &&
        (findDeleted ? true : !item.isDeleted()),
    )
  }

  async create(chat: Chat): Promise<void> {
    this.items.push(chat)
  }

  async createMany(entities: Chat[]): Promise<void> {
    this.items.push(...entities)
  }

  async save(chat: Chat): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === chat.id.toString(),
    )

    this.items[itemIndex] = chat
  }
}
