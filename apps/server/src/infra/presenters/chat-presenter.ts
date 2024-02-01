import { Chat, isPrivateChat } from '@/domain/chat/enterprise/types/chat'
import { HttpChat } from '@whatshare/http-schemas/types'
import { WsChat } from '@whatshare/ws-schemas/types'
import { GroupChatPresenter } from './group-chat-presenter'
import { PrivateChatPresenter } from './private-chat-presenter'

export class ChatPresenter {
  static toHttp(chat: Chat): HttpChat {
    return isPrivateChat(chat)
      ? PrivateChatPresenter.toHttp(chat)
      : GroupChatPresenter.toHttp(chat)
  }

  static toWs(chat: Chat): WsChat {
    return isPrivateChat(chat)
      ? PrivateChatPresenter.toWs(chat)
      : GroupChatPresenter.toWs(chat)
  }
}
