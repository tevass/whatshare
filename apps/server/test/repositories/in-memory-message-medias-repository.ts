import { MessageMediasRepository } from '@/domain/chat/application/repositories/message-medias-repository'
import { MessageMedia } from '@/domain/chat/enterprise/entities/message-media'
import { BaseInMemory } from './base-in-memory'

export class InMemoryMessageMediasRepository
  extends BaseInMemory<MessageMedia>
  implements MessageMediasRepository {}
