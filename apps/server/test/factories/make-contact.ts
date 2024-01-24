import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { faker } from '@faker-js/faker'
import { makeWAEntityID } from './make-wa-entity-id'
import { makeContactPhone } from './value-objects/make-contact-phone'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaContactMapper } from '@/infra/database/prisma/mappers/prisma-contact-mapper'
import {
  Contact,
  ContactProps,
} from '@/domain/chat/enterprise/entities/contact'

export const makeContact = (
  override: Partial<ContactProps> = {},
  id?: UniqueEntityID,
) => {
  return Contact.create(
    {
      imageUrl: faker.image.avatar(),
      name: faker.person.firstName(),
      phone: makeContactPhone(),
      waContactId: makeWAEntityID(),
      ...override,
    },
    id,
  )
}

@Injectable()
export class FakeContactFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaContact(
    data: Partial<ContactProps> = {},
    id?: UniqueEntityID,
  ): Promise<Contact> {
    const contact = makeContact(data, id)

    await this.prisma.contact.create({
      data: PrismaContactMapper.toPrismaCreate(contact),
    })

    return contact
  }
}
