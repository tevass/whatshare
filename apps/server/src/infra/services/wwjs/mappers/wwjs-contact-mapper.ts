import { WAEntityID } from '@/core/entities/wa-entity-id'
import { WAContact } from '@/domain/chat/application/entities/wa-contact'
import { Text } from '@/infra/utils/text'
import { Contact } from 'whatsapp-web.js'

interface ContactToDomain {
  raw: Contact
}

export class WWJSContactMapper {
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
        name: Text.nonEmptyOrNull(raw.name),
        pushName: Text.nonEmptyOrNull(raw.pushname),
        shortName: Text.nonEmptyOrNull(raw.shortName),
      },
      id,
    )
  }
}
