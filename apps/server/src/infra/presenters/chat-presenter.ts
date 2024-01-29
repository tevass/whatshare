import { Chat } from '@/domain/chat/enterprise/entities/chat'
import { WsChat } from '@whatshare/ws-schemas/entities'
import { ContactPresenter } from './contact-presenter'
import { HttpChat } from '@whatshare/http-schemas/entities'
import { MessagePresenter } from './message-presenter'

export class ChatPresenter {
  static toHttp(chat: Chat): HttpChat {
    return {
      id: chat.id.toString(),
      waChatId: chat.waChatId.toString(),
      whatsAppId: chat.whatsAppId.toString(),
      unreadCount: chat.unreadCount,
      lastInteraction: chat.lastInteraction,
      contact: ContactPresenter.toWs(chat.contact),
      lastMessage: chat.hasMessage()
        ? MessagePresenter.toHttp(chat.lastMessage)
        : null,
    }
  }

  static toWs(chat: Chat): WsChat {
    return {
      id: chat.id.toString(),
      waChatId: chat.waChatId.toString(),
      whatsAppId: chat.whatsAppId.toString(),
      unreadCount: chat.unreadCount,
      lastInteraction: chat.lastInteraction,
      contact: ContactPresenter.toWs(chat.contact),
      lastMessage: chat.hasMessage()
        ? MessagePresenter.toWs(chat.lastMessage)
        : null,
    }
  }
}
