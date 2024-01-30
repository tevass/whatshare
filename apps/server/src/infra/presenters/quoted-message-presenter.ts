import { Message } from '@/domain/chat/enterprise/entities/message'
import { HttpQuotedMessage } from '@whatshare/http-schemas/entities'
import { WsQuotedMessage } from '@whatshare/ws-schemas/entities'
import { ContactPresenter } from './contact-presenter'
import { MessageBodyPresenter } from './message-body-presenter'

export class QuotedMessagePresenter {
  static toHttp(message: Message): HttpQuotedMessage {
    return {
      id: message.id.toString(),
      chatId: message.chatId.toString(),
      waChatId: message.waChatId.toString(),
      whatsAppId: message.whatsAppId.toString(),
      waMessageId: message.waMessageId.toString(),
      ack: message.ack,
      type: message.type,
      author: message.hasAuthor()
        ? ContactPresenter.toHttp(message.author)
        : null,
      body: message.hasBody()
        ? MessageBodyPresenter.toHttp(message.body)
        : null,
      isBroadcast: message.isBroadcast,
      isForwarded: message.isForwarded,
      isFromMe: message.isFromMe,
      isGif: message.isGif,
      isStatus: message.isStatus,
      createdAt: message.createdAt,
      revokedAt: message.revokedAt,
    }
  }

  static toWs(message: Message): WsQuotedMessage {
    return {
      id: message.id.toString(),
      chatId: message.chatId.toString(),
      waChatId: message.waChatId.toString(),
      whatsAppId: message.whatsAppId.toString(),
      waMessageId: message.waMessageId.toString(),
      ack: message.ack,
      type: message.type,
      author: message.hasAuthor()
        ? ContactPresenter.toWs(message.author)
        : null,
      body: message.hasBody() ? MessageBodyPresenter.toWs(message.body) : null,
      isBroadcast: message.isBroadcast,
      isForwarded: message.isForwarded,
      isFromMe: message.isFromMe,
      isGif: message.isGif,
      isStatus: message.isStatus,
      createdAt: message.createdAt,
      revokedAt: message.revokedAt,
    }
  }
}
