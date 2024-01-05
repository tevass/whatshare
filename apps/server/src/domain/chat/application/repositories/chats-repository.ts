import { WAEntityID } from '@/core/entities/wa-entity-id'
import { Chat } from '../../enterprise/entities/chat'

export interface FindByWAChatIdAndWhatsAppIdParams {
  whatsAppId: string
  waChatId: WAEntityID
}

export abstract class ChatsRepository {
  abstract findById(id: string): Promise<Chat | null>

  abstract findManyByWhatsAppId(whatsAppId: string): Promise<Chat[]>

  abstract findByWAChatIdAndWhatsAppId(
    params: FindByWAChatIdAndWhatsAppIdParams,
    includeDeleted?: boolean,
  ): Promise<Chat | null>

  abstract findManyByWAChatsIds(waChatsIds: WAEntityID[]): Promise<Chat[]>

  abstract save(chat: Chat): Promise<void>

  abstract create(chat: Chat): Promise<void>

  abstract createMany(chats: Chat[]): Promise<void>
}
