import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WAEntityID } from '@/core/entities/wa-entity-id'
import { WAChat } from '@/domain/chat/application/entities/wa-chat'
import { Chat, Client, GroupChat } from 'whatsapp-web.js'
import { WWJSContactMapper } from './wwjs-contact-mapper'

interface WAChatToDomain {
  raw: Chat | GroupChat
  waClientId: UniqueEntityID
  client: Client
}

function isWWJSGroupChat(chat: Chat): chat is GroupChat {
  return chat.isGroup
}

export class WWJSChatMapper {
  static async toDomain({
    raw,
    waClientId,
    client,
  }: WAChatToDomain): Promise<WAChat> {
    const id = WAEntityID.createFromString(raw.id._serialized)

    const waContact = await raw.getContact()
    const contact = await WWJSContactMapper.toDomain({ raw: waContact })

    const rawParticipants = isWWJSGroupChat(raw)
      ? await Promise.all(
          raw.participants.map((raw) =>
            client.getContactById(raw.id._serialized),
          ),
        )
      : null

    const participants = rawParticipants?.length
      ? await Promise.all(
          rawParticipants.map((raw) => WWJSContactMapper.toDomain({ raw })),
        )
      : null

    return WAChat.create(
      {
        contact,
        waClientId,
        name: raw.name,
        isGroup: raw.isGroup,
        timestamp: raw.timestamp,
        unreadCount: raw.unreadCount,
        imageUrl: contact.imageUrl,
        participants,
      },
      id,
    )
  }
}
