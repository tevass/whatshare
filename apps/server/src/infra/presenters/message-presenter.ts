import { Message } from '@/domain/chat/enterprise/entities/message'
import { WsMessage } from '@whatshare/ws-schemas/entities'
import { ContactPresenter } from './contact-presenter'
import { MessageMediaPresenter } from './message-media-presenter'
import { AttendantProfilePresenter } from './attendant-profile-presenter'
import { HttpMessage } from '@whatshare/http-schemas/entities'

export class MessagePresenter {
  static toHttp(message: Message): HttpMessage {
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
      body: message.hasBody() ? message.body.format() : null,
      contacts: message.hasContacts()
        ? message.contacts.map(ContactPresenter.toHttp)
        : null,
      isBroadcast: message.isBroadcast,
      isForwarded: message.isForwarded,
      isFromMe: message.isFromMe,
      isGif: message.isGif,
      isStatus: message.isStatus,
      media: message.hasMedia()
        ? MessageMediaPresenter.toHttp(message.media)
        : null,
      quoted: message.hasQuoted()
        ? MessagePresenter.toHttp(message.quoted)
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

  static toWs(message: Message): WsMessage {
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
      body: message.hasBody() ? message.body.format() : null,
      contacts: message.hasContacts()
        ? message.contacts.map(ContactPresenter.toWs)
        : null,
      isBroadcast: message.isBroadcast,
      isForwarded: message.isForwarded,
      isFromMe: message.isFromMe,
      isGif: message.isGif,
      isStatus: message.isStatus,
      media: message.hasMedia()
        ? MessageMediaPresenter.toWs(message.media)
        : null,
      quoted: message.hasQuoted()
        ? MessagePresenter.toWs(message.quoted)
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
