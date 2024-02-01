import { GroupMessage } from '@/domain/chat/enterprise/entities/group-message'
import { HttpGroupMessage } from '@whatshare/http-schemas/entities'
import { WsGroupMessage } from '@whatshare/ws-schemas/entities'
import { AttendantProfilePresenter } from './attendant-profile-presenter'
import { ContactPresenter } from './contact-presenter'
import { GroupQuotedMessagePresenter } from './group-quoted-message-presenter'
import { MessageBodyPresenter } from './message-body-presenter'
import { MessageMediaPresenter } from './message-media-presenter'

export class GroupMessagePresenter {
  static toHttp(message: GroupMessage): HttpGroupMessage {
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
      isForwarded: message.isForwarded,
      isFromMe: message.isFromMe,
      isGif: message.isGif,
      author: ContactPresenter.toHttp(message.author),
      mentions: message.hasMentions()
        ? message.mentions.map(ContactPresenter.toHttp)
        : null,
      media: message.hasMedia()
        ? MessageMediaPresenter.toHttp(message.media)
        : null,
      quoted: message.hasQuoted()
        ? GroupQuotedMessagePresenter.toHttp(message.quoted)
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

  static toWs(message: GroupMessage): WsGroupMessage {
    return {
      id: message.id.toString(),
      chatId: message.chatId.toString(),
      waChatId: message.waChatId.toString(),
      whatsAppId: message.whatsAppId.toString(),
      waMessageId: message.waMessageId.toString(),
      ack: message.ack,
      type: message.type,
      body: message.hasBody() ? MessageBodyPresenter.toWs(message.body) : null,
      author: ContactPresenter.toWs(message.author),
      mentions: message.hasMentions()
        ? message.mentions.map(ContactPresenter.toWs)
        : null,
      contacts: message.contacts?.map(ContactPresenter.toWs) ?? null,
      isForwarded: message.isForwarded,
      isFromMe: message.isFromMe,
      isGif: message.isGif,
      media: message.hasMedia()
        ? MessageMediaPresenter.toWs(message.media)
        : null,
      quoted: message.hasQuoted()
        ? GroupQuotedMessagePresenter.toWs(message.quoted)
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
