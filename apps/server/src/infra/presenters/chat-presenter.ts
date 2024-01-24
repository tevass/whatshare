import { Chat } from '@/domain/chat/enterprise/entities/chat'
import { WsChat } from '@whatshare/ws-schemas/entities'
import { ContactPresenter } from './contact-presenter'

export class ChatPresenter {
  static toWs(chat: Chat): WsChat {
    return {
      id: chat.id.toString(),
      waChatId: chat.waChatId.toString(),
      whatsAppId: chat.whatsAppId.toString(),
      unreadCount: chat.unreadCount,
      lastInteraction: chat.lastInteraction,
      contact: ContactPresenter.toWs(chat.contact),
      lastMessage: null,
    }
  }
}
