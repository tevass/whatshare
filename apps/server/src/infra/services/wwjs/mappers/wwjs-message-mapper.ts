import { WAEntityID } from '@/core/entities/wa-entity-id'
import { WAMessageID } from '@/core/entities/wa-message-id'
import { WAContact } from '@/domain/chat/application/entities/wa-contact'
import { WAMessage } from '@/domain/chat/application/entities/wa-message'
import { Message } from 'whatsapp-web.js'
import { Text } from '../utils/text'
import { WWJSMessageAckMapper } from './wwjs-message-ack-mapper'
import { WWJSMessageMediaMapper } from './wwjs-message-media-mapper'
import { WWJSMessageTypeMapper } from './wwjs-message-type-mapper'

interface WAMessageToDomain {
  raw: Message
  chatId?: WAEntityID
}

export class WWJSMessageMapper {
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
        ack: WWJSMessageAckMapper.toDomain(raw.ack),
        chatId: waChatId,
        isBroadcast: raw.broadcast,
        isForwarded: raw.isForwarded,
        isFromMe: raw.fromMe,
        isGif: raw.isGif,
        isStatus: raw.isStatus,
        timestamp: raw.timestamp,
        type: WWJSMessageTypeMapper.toDomain(raw.type),
        body: Text.getStringOrNull(raw.body),
        media: media ? WWJSMessageMediaMapper.toDomain(media) : null,
        contacts: hasContacts
          ? raw.vCards.map(WAContact.createFromVCard)
          : null,
        quoted: quoted
          ? await WWJSMessageMapper.toDomain({
              raw: quoted,
              chatId: waChatId,
            })
          : null,
      },
      id,
    )
  }
}
