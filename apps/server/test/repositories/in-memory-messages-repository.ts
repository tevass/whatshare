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
import { Message } from '@/domain/chat/enterprise/types/message'
import { Pagination } from '@/domain/shared/enterprise/utilities/pagination'
import dayjs from 'dayjs'

export class InMemoryMessagesRepository implements MessagesRepository {
  items: Message[] = []

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
    const { chatId, page, take } = params

    return this.items
      .filter((item) => item.chatId.toString() === chatId)
      .slice(Pagination.skip({ limit: take, page }), page * take)
  }

  async countManyByChatId(
    params: MessagesRepositoryCountManyByChatIdParams,
  ): Promise<number> {
    const { chatId } = params

    return this.items.filter((item) => item.chatId.toString() === chatId).length
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

  private delete(message: Message) {
    this.items = this.items.filter((item) => !item.id.equals(message.id))
  }

  async deleteManyByChatId(
    params: MessagesRepositoryDeleteManyByChatIdParams,
  ): Promise<void> {
    const { chatId } = params

    const entities = this.items.filter(
      (item) => item.chatId.toString() === chatId,
    )

    await Promise.all(entities.map((message) => this.delete(message)))
  }

  async getMessagesIdsByChatId(
    params: MessagesRepositoryGetMessagesIdsByChatIdParams,
  ): Promise<UniqueEntityID[]> {
    const { chatId } = params

    const messages = this.items.filter(
      (message) => message.chatId.toString() === chatId,
    )

    return messages.map((message) => message.id)
  }
}
