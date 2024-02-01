import { PrivateMessage } from '@/domain/chat/enterprise/entities/private-message'
import { HttpPrivateMessage } from '@whatshare/http-schemas/entities'
import { WsPrivateMessage } from '@whatshare/ws-schemas/entities'
import { AttendantProfilePresenter } from './attendant-profile-presenter'
import { ContactPresenter } from './contact-presenter'
import { MessageBodyPresenter } from './message-body-presenter'
import { MessageMediaPresenter } from './message-media-presenter'
import { PrivateQuotedMessagePresenter } from './private-quoted-message-presenter'

export class PrivateMessagePresenter {
  static toHttp(message: PrivateMessage): HttpPrivateMessage {
    return {
      id: message.id.toString(),
      chatId: message.chatId.toString(),
      waChatId: message.waChatId.toString(),
      whatsAppId: message.whatsAppId.toString(),
      waMessageId: message.waMessageId.toString(),
      ack: message.ack,
      type: message.type,
      body: message.hasBody()
        ? MessageBodyPresenter.toHttp(message.body)
        : null,
      contacts: message.contacts?.map(ContactPresenter.toHttp) ?? null,
      isBroadcast: message.isBroadcast,
      isForwarded: message.isForwarded,
      isFromMe: message.isFromMe,
      isGif: message.isGif,
      isStatus: message.isStatus,
      media: message.hasMedia()
        ? MessageMediaPresenter.toHttp(message.media)
        : null,
      quoted: message.hasQuoted()
        ? PrivateQuotedMessagePresenter.toHttp(message.quoted)
        : null,
      revokedBy: message.hasRevoker()
        ? AttendantProfilePresenter.toHttp(message.revokedBy)
        : null,
      senderBy: message.hasSender()
        ? AttendantProfilePresenter.toHttp(message.senderBy)
        : null,
      createdAt: message.createdAt,
      revokedAt: message.revokedAt,
    }
  }

  static toWs(message: PrivateMessage): WsPrivateMessage {
    return {
      id: message.id.toString(),
      chatId: message.chatId.toString(),
      waChatId: message.waChatId.toString(),
      whatsAppId: message.whatsAppId.toString(),
      waMessageId: message.waMessageId.toString(),
      ack: message.ack,
      type: message.type,
      body: message.hasBody() ? MessageBodyPresenter.toWs(message.body) : null,
      contacts: message.contacts?.map(ContactPresenter.toWs) ?? null,
      isBroadcast: message.isBroadcast,
      isForwarded: message.isForwarded,
      isFromMe: message.isFromMe,
      isGif: message.isGif,
      isStatus: message.isStatus,
      media: message.hasMedia()
        ? MessageMediaPresenter.toWs(message.media)
        : null,
      quoted: message.hasQuoted()
        ? PrivateQuotedMessagePresenter.toWs(message.quoted)
        : null,
      revokedBy: message.hasRevoker()
        ? AttendantProfilePresenter.toWs(message.revokedBy)
        : null,
      senderBy: message.hasSender()
        ? AttendantProfilePresenter.toWs(message.senderBy)
        : null,
      createdAt: message.createdAt,
      revokedAt: message.revokedAt,
    }
  }
}
