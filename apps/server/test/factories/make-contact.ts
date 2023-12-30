import {
  Contact,
  ContactProps,
} from '@/domain/chat/enterprise/entities/contact'
import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '@whatshare/server-core/entities'
import { makeWAEntityID } from '@whatshare/server-core/factories'
import { makeContactPhone } from './value-objects/make-contact-phone'

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
