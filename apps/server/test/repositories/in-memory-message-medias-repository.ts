import { MessageMediasRepository } from '@/domain/chat/application/repositories/message-medias-repository'
import { MessageMedia } from '@/domain/chat/enterprise/entities/message-media'

export class InMemoryMessageMediasRepository
  implements MessageMediasRepository
{
  items: MessageMedia[] = []

  async create(messageMedia: MessageMedia): Promise<void> {
    this.items.push(messageMedia)
  }

  async delete(messageMedia: MessageMedia): Promise<void> {
    this.items = this.items.filter((item) => !item.id.equals(messageMedia.id))
  }
}
