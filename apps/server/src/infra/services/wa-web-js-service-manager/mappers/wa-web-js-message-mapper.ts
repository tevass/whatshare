import { WAEntityID } from '@/core/entities/wa-entity-id'
import { WAMessageID } from '@/core/entities/wa-message-id'
import { WAContact } from '@/domain/chat/application/entities/wa-contact'
import { WAMessage } from '@/domain/chat/application/entities/wa-message'
import { Message } from 'whatsapp-web.js'
import { Text } from '../utils/text'
import { WAWebJSMessageAckMapper } from './wa-web-js-message-ack-mapper'
import { WAWebJSMessageMediaMapper } from './wa-web-js-message-media-mapper'
import { WAWebJSMessageTypeMapper } from './wa-web-js-message-type-mapper'

interface WAMessageToDomain {
  raw: Message
  chatId?: WAEntityID
}

export class WAWebJSMessageMapper {
  static async toDomain({
    raw,
    chatId,
  }: WAMessageToDomain): Promise<WAMessage> {
    const id = WAMessageID.createFromString(raw.id._serialized)

    const waChatId =
      chatId ??
      WAEntityID.createFromString((await raw.getChat()).id._serialized)

    const [media, quoted] = await Promise.all([
      raw.hasMedia ? raw.downloadMedia() : null,
      raw.hasQuotedMsg ? raw.getQuotedMessage() : null,
    ])

    const hasContacts = !!raw.vCards.length

    return WAMessage.create(
      {
        author: raw.author ? WAEntityID.createFromString(raw.author) : null,
        ack: WAWebJSMessageAckMapper.toDomain(raw.ack),
        chatId: waChatId,
        isBroadcast: raw.broadcast,
        isForwarded: raw.isForwarded,
        isFromMe: raw.fromMe,
        isGif: raw.isGif,
        isStatus: raw.isStatus,
        timestamp: raw.timestamp,
        type: WAWebJSMessageTypeMapper.toDomain(raw.type),
        body: Text.getStringOrNull(raw.body),
        media: media ? WAWebJSMessageMediaMapper.toDomain(media) : null,
        contacts: hasContacts
          ? raw.vCards.map(WAContact.createFromVCard)
          : null,
        quoted: quoted
          ? await WAWebJSMessageMapper.toDomain({
              raw: quoted,
              chatId: waChatId,
            })
          : null,
      },
      id,
    )
  }
}
