import {
  ChatsRepository,
  ChatsRepositoryCountManyByWhatsAppIdParams,
  ChatsRepositoryFilters,
  ChatsRepositoryFindByWAChatIdAndWhatsAppIdParams,
  ChatsRepositoryFindManyByWAChatsIdsParams,
  ChatsRepositoryFindManyByWhatsAppIdParams,
} from '@/domain/chat/application/repositories/chats-repository'
import { Chat } from '@/domain/chat/enterprise/entities/chat'
import { Pagination } from '@/domain/shared/enterprise/utilities/pagination'
import { TypeGuards } from '@/infra/utils/type-guards'

interface ResolveFiltersParams extends ChatsRepositoryFilters {
  item: Chat
}

export class InMemoryChatsRepository implements ChatsRepository {
  items: Chat[] = []

  private resolveFilters({ item, ...filters }: ResolveFiltersParams) {
    const { deleted } = filters ?? {}

    return TypeGuards.isNotUndefined(deleted) && deleted
      ? item.isDeleted()
      : true
  }

  async findManyByWhatsAppId(
    params: ChatsRepositoryFindManyByWhatsAppIdParams,
  ): Promise<Chat[]> {
    const { whatsAppId, page, take, ...filters } = params

    return this.items
      .filter((item) => item.whatsAppId.toString() === whatsAppId)
      .filter((item) => this.resolveFilters({ item, ...filters }))
      .slice(Pagination.skip({ limit: take, page }), page * take)
  }

  async countManyByWhatsAppId(
    params: ChatsRepositoryCountManyByWhatsAppIdParams,
  ): Promise<number> {
    const { whatsAppId, ...filters } = params

    return this.items
      .filter((item) => item.whatsAppId.toString() === whatsAppId)
      .filter((item) => this.resolveFilters({ item, ...filters })).length
  }

  async findByWAChatIdAndWhatsAppId(
    params: ChatsRepositoryFindByWAChatIdAndWhatsAppIdParams,
  ): Promise<Chat | null> {
    const { waChatId, whatsAppId } = params

    const chat = this.items.find(
      (item) =>
        item.whatsAppId.toString() === whatsAppId &&
        item.waChatId.equals(waChatId),
    )

    if (!chat) return null

    return chat
  }

  async findManyByWAChatsIds(
    params: ChatsRepositoryFindManyByWAChatsIdsParams,
  ): Promise<Chat[]> {
    const { waChatsIds } = params

    return this.items.filter((item) => waChatsIds.includes(item.waChatId))
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

  async softDelete(chat: Chat): Promise<void> {
    chat.clear()
    await this.save(chat)
  }
}
