import {
  ChatsRepository,
  ChatsRepositoryCountManyByWhatsAppIdParams,
  ChatsRepositoryFilters,
  ChatsRepositoryFindByWAChatIdAndWhatsAppIdParams,
  ChatsRepositoryFindManyByWAChatsIdsParams,
  ChatsRepositoryFindManyByWhatsAppIdParams,
} from '@/domain/chat/application/repositories/chats-repository'
import { EitherChat } from '@/domain/chat/enterprise/entities/either-chat'
import { Pagination } from '@/domain/shared/enterprise/utilities/pagination'
import { TypeGuards } from '@/infra/utils/type-guards'

interface ResolveFiltersParams extends ChatsRepositoryFilters {
  item: EitherChat
}

export class InMemoryChatsRepository implements ChatsRepository {
  items: EitherChat[] = []

  private resolveFilters({ item, ...filters }: ResolveFiltersParams) {
    const { deleted } = filters ?? {}

    return TypeGuards.isNotUndefined(deleted) && deleted
      ? item.value.isDeleted()
      : true
  }

  async findManyByWhatsAppId(
    params: ChatsRepositoryFindManyByWhatsAppIdParams,
  ): Promise<EitherChat[]> {
    const { whatsAppId, page, take, ...filters } = params

    return this.items
      .filter((item) => item.value.whatsAppId.toString() === whatsAppId)
      .filter((item) => this.resolveFilters({ item, ...filters }))
      .slice(Pagination.skip({ limit: take, page }), page * take)
  }

  async countManyByWhatsAppId(
    params: ChatsRepositoryCountManyByWhatsAppIdParams,
  ): Promise<number> {
    const { whatsAppId, ...filters } = params

    return this.items
      .filter((item) => item.value.whatsAppId.toString() === whatsAppId)
      .filter((item) => this.resolveFilters({ item, ...filters })).length
  }

  async findByWAChatIdAndWhatsAppId(
    params: ChatsRepositoryFindByWAChatIdAndWhatsAppIdParams,
  ): Promise<EitherChat | null> {
    const { waChatId, whatsAppId } = params

    const chat = this.items.find(
      (item) =>
        item.value.whatsAppId.toString() === whatsAppId &&
        item.value.waChatId.equals(waChatId),
    )

    if (!chat) return null

    return chat
  }

  async findManyByWAChatsIds(
    params: ChatsRepositoryFindManyByWAChatsIdsParams,
  ): Promise<EitherChat[]> {
    const { waChatsIds } = params

    return this.items.filter((item) => waChatsIds.includes(item.value.waChatId))
  }

  async create(chat: EitherChat): Promise<void> {
    this.items.push(chat)
  }

  async createMany(entities: EitherChat[]): Promise<void> {
    this.items.push(...entities)
  }

  async save(chat: EitherChat): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.value.id.toString() === chat.value.id.toString(),
    )

    this.items[itemIndex] = chat
  }

  async softDelete(chat: EitherChat): Promise<void> {
    chat.value.clear()
    await this.save(chat)
  }
}
