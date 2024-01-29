import {
  MessageMediasRepository,
  MessageMediasRepositoryFindManyByMessagesIdsParams,
} from '@/domain/chat/application/repositories/message-medias-repository'
import { MessageMedia } from '@/domain/chat/enterprise/entities/message-media'
import { InMemoryMessagesRepository } from './in-memory-messages-repository'

export class InMemoryMessageMediasRepository
  implements MessageMediasRepository
{
  constructor(private messagesRepository: InMemoryMessagesRepository) {}

  items: MessageMedia[] = []

  async findManyByMessagesIds(
    params: MessageMediasRepositoryFindManyByMessagesIdsParams,
  ): Promise<MessageMedia[]> {
    const { messagesIds } = params

    const messages = this.messagesRepository.items
      .filter((message) => message.hasMedia())
      .filter((message) => messagesIds.includes(message.id.toString()))

    const mediasIds = messages.map((message) => message.media!.id.toString())

    return this.items.filter((item) => mediasIds.includes(item.id.toString()))
  }

  async create(messageMedia: MessageMedia): Promise<void> {
    this.items.push(messageMedia)
  }

  async delete(messageMedia: MessageMedia): Promise<void> {
    this.items = this.items.filter((item) => !item.id.equals(messageMedia.id))
  }

  async deleteMany(medias: MessageMedia[]): Promise<void> {
    await Promise.all(medias.map((media) => this.delete(media)))
  }
}
