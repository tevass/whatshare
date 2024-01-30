import { WAEntityID } from '@/core/entities/wa-entity-id'
import { WAMessageID } from '@/core/entities/wa-message-id'
import { WAContact } from '@/domain/chat/application/entities/wa-contact'
import { WAMessage } from '@/domain/chat/application/entities/wa-message'
import { Text } from '@/infra/utils/text'
import { Message } from 'whatsapp-web.js'
import { WWJSMessageAckMapper } from './wwjs-message-ack-mapper'
import { WWJSMessageMediaMapper } from './wwjs-message-media-mapper'
import { WWJSMessageTypeMapper } from './wwjs-message-type-mapper'
import { WWJSContactMapper } from './wwjs-contact-mapper'

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

    const vCardContacts = raw.vCards.length
      ? raw.vCards.map(WAContact.createFromVCard)
      : null

    const [media, quoted, mentions] = await Promise.all([
      raw.hasMedia ? raw.downloadMedia() : null,
      raw.hasQuotedMsg ? raw.getQuotedMessage() : null,
      raw.mentionedIds.length ? raw.getMentions() : null,
    ])

    const messageMedia = media ? WWJSMessageMediaMapper.toDomain(media) : null

    const [quotedMessage, contactMentions] = await Promise.all([
      quoted
        ? WWJSMessageMapper.toDomain({
            raw: quoted,
            chatId: waChatId,
          })
        : null,
      mentions?.length
        ? Promise.all(
            mentions.map((raw) => WWJSContactMapper.toDomain({ raw })),
          )
        : null,
    ])

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
        body: Text.nonEmptyOrNull(raw.body),
        media: messageMedia,
        contacts: vCardContacts,
        mentions: contactMentions,
        quoted: quotedMessage,
      },
      id,
    )
  }
}
