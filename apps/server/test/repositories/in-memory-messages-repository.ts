import {
  MessagesRepository,
  MessagesRepositoryCountManyByChatIdParams,
  MessagesRepositoryDeleteManyByChatIdParams,
  MessagesRepositoryFilters,
  MessagesRepositoryFindByIdParams,
  MessagesRepositoryFindByWAMessageIdParams,
  MessagesRepositoryFindManyByChatIdParams,
  MessagesRepositoryFindManyByWAMessagesIdsParams,
  MessagesRepositoryFindToRevokeParams,
} from '@/domain/chat/application/repositories/messages-repository'
import { Message } from '@/domain/chat/enterprise/entities/message'
import { Pagination } from '@/domain/shared/enterprise/utilities/pagination'
import { TypeGuards } from '@/infra/utils/type-guards'
import dayjs from 'dayjs'

interface ResolveFiltersParams extends MessagesRepositoryFilters {
  item: Message
}

export class InMemoryMessagesRepository implements MessagesRepository {
  items: Message[] = []

  private resolveFilters({ item, ...filters }: ResolveFiltersParams) {
    const { deleted } = filters ?? {}

    return TypeGuards.isNotUndefined(deleted) && deleted
      ? item.isDeleted()
      : true
  }

  async findById(
    params: MessagesRepositoryFindByIdParams,
  ): Promise<Message | null> {
    const { id } = params

    const item = this.items.find((item) => item.id.toString() === id)

    if (!item) return null

    return item
  }

  async findManyByChatId(
    params: MessagesRepositoryFindManyByChatIdParams,
  ): Promise<Message[]> {
    const { chatId, page, take, ...filters } = params

    return this.items
      .filter((item) => item.chatId.toString() === chatId)
      .filter((item) => this.resolveFilters({ item, ...filters }))
      .slice(Pagination.skip({ limit: take, page }), page * take)
  }

  async countManyByChatId(
    params: MessagesRepositoryCountManyByChatIdParams,
  ): Promise<number> {
    const { chatId, ...filters } = params

    return this.items
      .filter((item) => item.chatId.toString() === chatId)
      .filter((item) => this.resolveFilters({ item, ...filters })).length
  }

  async findByWAMessageId(
    params: MessagesRepositoryFindByWAMessageIdParams,
  ): Promise<Message | null> {
    const { waMessageId } = params

    const item = this.items.find((item) => item.waMessageId.equals(waMessageId))

    if (!item) return null

    return item
  }

  async findManyByWAMessagesIds(
    params: MessagesRepositoryFindManyByWAMessagesIdsParams,
  ): Promise<Message[]> {
    const { waMessagesIds } = params

    return this.items.filter((item) => waMessagesIds.includes(item.waMessageId))
  }

  async findToRevoke(
    params: MessagesRepositoryFindToRevokeParams,
  ): Promise<Message | null> {
    const { createdAt, waChatId, whatsAppId } = params

    const message = this.items.find(
      (item) =>
        item.waChatId.equals(waChatId) &&
        item.whatsAppId.toString() === whatsAppId &&
        dayjs(createdAt).isSame(item.createdAt),
    )

    if (!message) return null

    return message
  }

  async create(message: Message): Promise<void> {
    this.items.push(message)
  }

  async save(message: Message): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === message.id.toString(),
    )

    this.items[itemIndex] = message
  }

  async softDeleteManyByChatId(
    params: MessagesRepositoryDeleteManyByChatIdParams,
  ): Promise<void> {
    const { chatId } = params

    const entities = this.items.filter(
      (item) => item.chatId.toString() === chatId,
    )

    await Promise.all(
      entities.map((message) => {
        message.delete()
        return this.save(message)
      }),
    )
  }
}
