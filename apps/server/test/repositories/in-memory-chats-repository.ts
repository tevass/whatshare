import {
  ChatsRepository,
  FindByWAChatIdAndWhatsAppIdParams,
} from '@/domain/chat/application/repositories/chats-repository'
import { Chat } from '@/domain/chat/enterprise/entities/chat'
import { BaseInMemory } from './base-in-memory'

export class InMemoryChatsRepository
  extends BaseInMemory<Chat>
  implements ChatsRepository
{
  async findByWAChatIdAndWhatsAppId(
    params: FindByWAChatIdAndWhatsAppIdParams,
  ): Promise<Chat | null> {
    const { waChatId, whatsAppId } = params

    const chat = this.items.find(
      (item) =>
        item.whatsAppId.toString() === whatsAppId &&
        item.waChatId.equals(waChatId),
    )

    if (!chat) return null

    return chat
  }
}
