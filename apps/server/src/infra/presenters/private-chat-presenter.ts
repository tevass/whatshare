import { PrivateChat } from '@/domain/chat/enterprise/entities/private-chat'
import { HttpPrivateChat } from '@whatshare/http-schemas/entities'
import { WsPrivateChat } from '@whatshare/ws-schemas/entities'
import { ContactPresenter } from './contact-presenter'
import { PrivateMessagePresenter } from './private-message-presenter'

export class PrivateChatPresenter {
  static toHttp(chat: PrivateChat): HttpPrivateChat {
    return {
      id: chat.id.toString(),
      waChatId: chat.waChatId.toString(),
      whatsAppId: chat.whatsAppId.toString(),
      unreadCount: chat.unreadCount,
      lastInteraction: chat.lastInteraction,
      contact: ContactPresenter.toWs(chat.contact),
      lastMessage: chat.hasMessage()
        ? PrivateMessagePresenter.toHttp(chat.lastMessage)
        : null,
      deletedAt: chat.deletedAt,
      isGroup: chat.isGroup,
    }
  }

  static toWs(chat: PrivateChat): WsPrivateChat {
    return {
      id: chat.id.toString(),
      waChatId: chat.waChatId.toString(),
      whatsAppId: chat.whatsAppId.toString(),
      unreadCount: chat.unreadCount,
      lastInteraction: chat.lastInteraction,
      contact: ContactPresenter.toWs(chat.contact),
      lastMessage: chat.hasMessage()
        ? PrivateMessagePresenter.toWs(chat.lastMessage)
        : null,
      deletedAt: chat.deletedAt,
      isGroup: chat.isGroup,
    }
  }
}
