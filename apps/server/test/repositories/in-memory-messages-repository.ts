import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  MessagesRepository,
  MessagesRepositoryCountManyByChatIdParams,
  MessagesRepositoryDeleteManyByChatIdParams,
  MessagesRepositoryFindByIdParams,
  MessagesRepositoryFindByWAMessageIdParams,
  MessagesRepositoryFindManyByChatIdParams,
  MessagesRepositoryFindManyByWAMessagesIdsParams,
  MessagesRepositoryFindToRevokeParams,
  MessagesRepositoryGetMessagesIdsByChatIdParams,
} from '@/domain/chat/application/repositories/messages-repository'
import { EitherMessage } from '@/domain/chat/enterprise/entities/either-message'
import { Pagination } from '@/domain/shared/enterprise/utilities/pagination'
import dayjs from 'dayjs'

export class InMemoryMessagesRepository implements MessagesRepository {
  items: EitherMessage[] = []

  async findById(
    params: MessagesRepositoryFindByIdParams,
  ): Promise<EitherMessage | null> {
    const { id } = params

    const item = this.items.find((item) => item.value.id.toString() === id)

    if (!item) return null

    return item
  }

  async findManyByChatId(
    params: MessagesRepositoryFindManyByChatIdParams,
  ): Promise<EitherMessage[]> {
    const { chatId, page, take } = params

    return this.items
      .filter((item) => item.value.chatId.toString() === chatId)
      .slice(Pagination.skip({ limit: take, page }), page * take)
  }

  async countManyByChatId(
    params: MessagesRepositoryCountManyByChatIdParams,
  ): Promise<number> {
    const { chatId } = params

    return this.items.filter((item) => item.value.chatId.toString() === chatId)
      .length
  }

  async findByWAMessageId(
    params: MessagesRepositoryFindByWAMessageIdParams,
  ): Promise<EitherMessage | null> {
    const { waMessageId } = params

    const item = this.items.find((item) =>
      item.value.waMessageId.equals(waMessageId),
    )

    if (!item) return null

    return item
  }

  async findManyByWAMessagesIds(
    params: MessagesRepositoryFindManyByWAMessagesIdsParams,
  ): Promise<EitherMessage[]> {
    const { waMessagesIds } = params

    return this.items.filter((item) =>
      waMessagesIds.includes(item.value.waMessageId),
    )
  }

  async findToRevoke(
    params: MessagesRepositoryFindToRevokeParams,
  ): Promise<EitherMessage | null> {
    const { createdAt, waChatId, whatsAppId } = params

    const message = this.items.find(
      (item) =>
        item.value.waChatId.equals(waChatId) &&
        item.value.whatsAppId.toString() === whatsAppId &&
        dayjs(createdAt).isSame(item.value.createdAt),
    )

    if (!message) return null

    return message
  }

  async create(message: EitherMessage): Promise<void> {
    this.items.push(message)
  }

  async save(message: EitherMessage): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.value.id.toString() === message.value.id.toString(),
    )

    this.items[itemIndex] = message
  }

  private delete(message: EitherMessage) {
    this.items = this.items.filter(
      (item) => !item.value.id.equals(message.value.id),
    )
  }

  async deleteManyByChatId(
    params: MessagesRepositoryDeleteManyByChatIdParams,
  ): Promise<void> {
    const { chatId } = params

    const entities = this.items.filter(
      (item) => item.value.chatId.toString() === chatId,
    )

    await Promise.all(entities.map((message) => this.delete(message)))
  }

  async getMessagesIdsByChatId(
    params: MessagesRepositoryGetMessagesIdsByChatIdParams,
  ): Promise<UniqueEntityID[]> {
    const { chatId } = params

    const messages = this.items.filter(
      (message) => message.value.chatId.toString() === chatId,
    )

    return messages.map((message) => message.value.id)
  }
}
