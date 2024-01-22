import { WAEntityID } from '@/core/entities/wa-entity-id'
import { WAContact } from '@/domain/chat/application/entities/wa-contact'
import { Contact } from 'whatsapp-web.js'
import { Text } from '../utils/text'

interface ContactToDomain {
  raw: Contact
}

export class WAWebJSContactMapper {
  static async toDomain({ raw }: ContactToDomain): Promise<WAContact> {
    const id = WAEntityID.createFromString(raw.id._serialized)

    const [imageUrl, formattedNumber] = await Promise.all([
      raw.getProfilePicUrl(),
      raw.getFormattedNumber(),
    ])

    return WAContact.create(
      {
        formattedNumber,
        imageUrl,
        isBusiness: raw.isBusiness,
        isEnterprise: raw.isEnterprise,
        isGroup: raw.isGroup,
        isMyContact: raw.isMyContact,
        number: raw.number,
        name: Text.getStringOrNull(raw.name),
        pushName: Text.getStringOrNull(raw.pushname),
        shortName: Text.getStringOrNull(raw.shortName),
      },
      id,
    )
  }
}
