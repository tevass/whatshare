import { GroupChat } from '@/domain/chat/enterprise/entities/group-chat'
import { HttpGroupChat } from '@whatshare/http-schemas/entities'
import { WsGroupChat } from '@whatshare/ws-schemas/entities'
import { ContactPresenter } from './contact-presenter'
import { GroupMessagePresenter } from './group-message-presenter'

export class GroupChatPresenter {
  static toHttp(chat: GroupChat): HttpGroupChat {
    return {
      id: chat.id.toString(),
      waChatId: chat.waChatId.toString(),
      whatsAppId: chat.whatsAppId.toString(),
      unreadCount: chat.unreadCount,
      lastInteraction: chat.lastInteraction,
      contact: ContactPresenter.toWs(chat.contact),
      lastMessage: chat.hasMessage()
        ? GroupMessagePresenter.toHttp(chat.lastMessage)
        : null,
      deletedAt: chat.deletedAt,
      isGroup: chat.isGroup,
      participants: chat.participants.getItems().map(ContactPresenter.toHttp),
    }
  }

  static toWs(chat: GroupChat): WsGroupChat {
    return {
      id: chat.id.toString(),
      waChatId: chat.waChatId.toString(),
      whatsAppId: chat.whatsAppId.toString(),
      unreadCount: chat.unreadCount,
      lastInteraction: chat.lastInteraction,
      contact: ContactPresenter.toWs(chat.contact),
      lastMessage: chat.hasMessage()
        ? GroupMessagePresenter.toWs(chat.lastMessage)
        : null,
      deletedAt: chat.deletedAt,
      isGroup: chat.isGroup,
      participants: chat.participants.getItems().map(ContactPresenter.toWs),
    }
  }
}
