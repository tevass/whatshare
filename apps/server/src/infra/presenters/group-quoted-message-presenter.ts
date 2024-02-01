import { GroupQuotedMessage } from '@/domain/chat/enterprise/entities/group-quoted-message'
import { HttpGroupQuotedMessage } from '@whatshare/http-schemas/entities'
import { WsGroupQuotedMessage } from '@whatshare/ws-schemas/entities'
import { AttendantProfilePresenter } from './attendant-profile-presenter'
import { ContactPresenter } from './contact-presenter'
import { MessageBodyPresenter } from './message-body-presenter'
import { MessageMediaPresenter } from './message-media-presenter'

export class GroupQuotedMessagePresenter {
  static toHttp(message: GroupQuotedMessage): HttpGroupQuotedMessage {
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
      media: message.hasMedia()
        ? MessageMediaPresenter.toHttp(message.media)
        : null,
      senderBy: message.hasSender()
        ? AttendantProfilePresenter.toHttp(message.senderBy)
        : null,
      author: ContactPresenter.toHttp(message.author),
      mentions: message.hasMentions()
        ? message.mentions.map(ContactPresenter.toHttp)
        : null,
    }
  }

  static toWs(message: GroupQuotedMessage): WsGroupQuotedMessage {
    return {
      id: message.id.toString(),
      chatId: message.chatId.toString(),
      waChatId: message.waChatId.toString(),
      whatsAppId: message.whatsAppId.toString(),
      waMessageId: message.waMessageId.toString(),
      type: message.type,
      body: message.hasBody() ? MessageBodyPresenter.toWs(message.body) : null,
      isFromMe: message.isFromMe,
      media: message.hasMedia()
        ? MessageMediaPresenter.toWs(message.media)
        : null,
      senderBy: message.hasSender()
        ? AttendantProfilePresenter.toWs(message.senderBy)
        : null,
      author: ContactPresenter.toWs(message.author),
      mentions: message.hasMentions()
        ? message.mentions.map(ContactPresenter.toWs)
        : null,
    }
  }
}
