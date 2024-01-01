import { WAEntityID } from '@/core/entities/wa-entity-id'
import { Chat } from '../../enterprise/entities/chat'

export interface FindByWAChatIdAndWhatsAppIdParams {
  whatsAppId: string
  waChatId: WAEntityID
}

export abstract class ChatsRepository {
  abstract findByIdOrThrow(id: string): Promise<Chat>

  abstract findByWAChatIdAndWhatsAppId(
    params: FindByWAChatIdAndWhatsAppIdParams,
  ): Promise<Chat | null>

  abstract save(chat: Chat): Promise<void>
}
