import {
  QuotedMessage,
  isPrivateQuotedMessage,
} from '@/domain/chat/enterprise/types/quoted-message'
import { HttpQuotedMessage } from '@whatshare/http-schemas/types'
import { WsQuotedMessage } from '@whatshare/ws-schemas/types'
import { GroupQuotedMessagePresenter } from './group-quoted-message-presenter'
import { PrivateQuotedMessagePresenter } from './private-quoted-message-presenter'

export class QuotedMessagePresenter {
  static toHttp(message: QuotedMessage): HttpQuotedMessage {
    return isPrivateQuotedMessage(message)
      ? PrivateQuotedMessagePresenter.toHttp(message)
      : GroupQuotedMessagePresenter.toHttp(message)
  }

  static toWs(message: QuotedMessage): WsQuotedMessage {
    return isPrivateQuotedMessage(message)
      ? PrivateQuotedMessagePresenter.toWs(message)
      : GroupQuotedMessagePresenter.toWs(message)
  }
}
