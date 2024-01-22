import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WAEntityID } from '@/core/entities/wa-entity-id'
import { WAChat } from '@/domain/chat/application/entities/wa-chat'
import { Chat } from 'whatsapp-web.js'
import { WAWebJSContactMapper } from './wa-web-js-contact-mapper'

interface WAChatToDomain {
  raw: Chat
  waClientId: UniqueEntityID
}

export class WAWebJSChatMapper {
  static async toDomain({ raw, waClientId }: WAChatToDomain): Promise<WAChat> {
    const id = WAEntityID.createFromString(raw.id._serialized)

    const waContact = await raw.getContact()
    const contact = await WAWebJSContactMapper.toDomain({ raw: waContact })

    return WAChat.create(
      {
        contact,
        waClientId,
        name: raw.name,
        isGroup: raw.isGroup,
        timestamp: raw.timestamp,
        unreadCount: raw.unreadCount,
        imageUrl: contact.imageUrl,
      },
      id,
    )
  }
}
