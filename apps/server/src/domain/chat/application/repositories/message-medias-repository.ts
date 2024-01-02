import { MessageMedia } from '../../enterprise/entities/message-media';

export abstract class MessageMediasRepository {
  abstract create(media: MessageMedia): Promise<void>

  abstract delete(media: MessageMedia): Promise<void>
}
