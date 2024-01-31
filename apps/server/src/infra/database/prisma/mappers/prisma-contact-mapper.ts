import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WAEntityID } from '@/core/entities/wa-entity-id'
import { Contact } from '@/domain/chat/enterprise/entities/contact'
import { ContactPhone } from '@/domain/chat/enterprise/entities/value-objects/contact-phone'
import { Prisma, Contact as PrismaContact } from '@prisma/client'

export type RawContact = PrismaContact

export class PrismaContactMapper {
  static toDomain(raw: RawContact): Contact {
    return Contact.create(
      {
        name: raw.name,
        phone: ContactPhone.create({
          number: raw.phone,
          formattedNumber: raw.formattedPhone,
        }),
        waContactId: WAEntityID.createFromString(raw.waContactId),
        imageUrl: raw.imageUrl,
        isBusiness: raw.isBusiness,
        isEnterprise: raw.isEnterprise,
        isGroup: raw.isGroup,
        isMyContact: raw.isMyContact,
        isWAClient: raw.isWAClient,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrismaCreate(contact: Contact): Prisma.ContactUncheckedCreateInput {
    return {
      id: contact.id.toString(),
      isBusiness: contact.isBusiness,
      isEnterprise: contact.isEnterprise,
      isGroup: contact.isGroup,
      isMyContact: contact.isMyContact,
      name: contact.name,
      phone: contact.phone.number,
      formattedPhone: contact.phone.formattedNumber,
      waContactId: contact.waContactId.toString(),
      imageUrl: contact.imageUrl,
      isWAClient: contact.isWAClient,
    }
  }

  static toPrismaUpdate(contact: Contact): Prisma.ContactUncheckedUpdateInput {
    return {
      isBusiness: contact.isBusiness,
      isEnterprise: contact.isEnterprise,
      isGroup: contact.isGroup,
      isMyContact: contact.isMyContact,
      name: contact.name,
      phone: contact.phone.number,
      formattedPhone: contact.phone.formattedNumber,
      waContactId: contact.waContactId.toString(),
      imageUrl: contact.imageUrl,
      isWAClient: contact.isWAClient,
    }
  }
}
