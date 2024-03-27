import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { faker } from '@faker-js/faker'
import { makeWAEntityID } from './make-wa-entity-id'
import { makeContactPhone } from './value-objects/make-contact-phone'
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
