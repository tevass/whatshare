import { PrivateQuotedMessage } from '@/domain/chat/enterprise/entities/private-quoted-message'
import { HttpPrivateQuotedMessage } from '@whatshare/http-schemas/entities'
import { WsPrivateQuotedMessage } from '@whatshare/ws-schemas/entities'
import { AttendantProfilePresenter } from './attendant-profile-presenter'
import { MessageBodyPresenter } from './message-body-presenter'
import { MessageMediaPresenter } from './message-media-presenter'

export class PrivateQuotedMessagePresenter {
  static toHttp(message: PrivateQuotedMessage): HttpPrivateQuotedMessage {
    return {
      id: message.id.toString(),
      chatId: message.chatId.toString(),
      waChatId: message.waChatId.toString(),
      whatsAppId: message.whatsAppId.toString(),
      waMessageId: message.waMessageId.toString(),
      type: message.type,
      body: message.hasBody()
        ? MessageBodyPresenter.toHttp(message.body)
        : null,
      isFromMe: message.isFromMe,
      isStatus: message.isStatus,
      media: message.hasMedia()
        ? MessageMediaPresenter.toHttp(message.media)
        : null,
      senderBy: message.hasSender()
        ? AttendantProfilePresenter.toHttp(message.senderBy)
        : null,
    }
  }

  static toWs(message: PrivateQuotedMessage): WsPrivateQuotedMessage {
    return {
      id: message.id.toString(),
      chatId: message.chatId.toString(),
      waChatId: message.waChatId.toString(),
      whatsAppId: message.whatsAppId.toString(),
      waMessageId: message.waMessageId.toString(),
      type: message.type,
      body: message.hasBody() ? MessageBodyPresenter.toWs(message.body) : null,
      isFromMe: message.isFromMe,
      isStatus: message.isStatus,
      media: message.hasMedia()
        ? MessageMediaPresenter.toWs(message.media)
        : null,
      senderBy: message.hasSender()
        ? AttendantProfilePresenter.toWs(message.senderBy)
        : null,
    }
  }
}
