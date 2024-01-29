import { MessageMedia } from '../../enterprise/entities/message-media'

export interface MessageMediasRepositoryFindManyByMessagesIdsParams {
  messagesIds: string[]
}

export interface MessageMediasRepositoryDeleteManyByMessageChatIdParams {
  chatId: string
}

export abstract class MessageMediasRepository {
  abstract findManyByMessagesIds(
    params: MessageMediasRepositoryFindManyByMessagesIdsParams,
  ): Promise<MessageMedia[]>

  abstract create(media: MessageMedia): Promise<void>

  abstract delete(media: MessageMedia): Promise<void>

  abstract deleteMany(medias: MessageMedia[]): Promise<void>
}
