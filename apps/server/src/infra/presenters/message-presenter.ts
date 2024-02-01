import {
  Message,
  isPrivateMessage,
} from '@/domain/chat/enterprise/types/message'
import { HttpMessage } from '@whatshare/http-schemas/types'
import { WsMessage } from '@whatshare/ws-schemas/types'
import { GroupMessagePresenter } from './group-message-presenter'
import { PrivateMessagePresenter } from './private-message-presenter'

export class MessagePresenter {
  static toHttp(message: Message): HttpMessage {
    return isPrivateMessage(message)
      ? PrivateMessagePresenter.toHttp(message)
      : GroupMessagePresenter.toHttp(message)
  }

  static toWs(message: Message): WsMessage {
    return isPrivateMessage(message)
      ? PrivateMessagePresenter.toWs(message)
      : GroupMessagePresenter.toWs(message)
  }
}
