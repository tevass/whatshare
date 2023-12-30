import { makeContactPhone } from '@/test/factories/value-objects/make-contact-phone'
import { faker } from '@faker-js/faker'
import { makeWAEntityID } from '@whatshare/server-core/factories'
import { Contact } from '../contact'

describe('Contact', () => {
  test('create', () => {
    const contact = Contact.create({
      name: faker.person.firstName(),
      waContactId: makeWAEntityID(),
      phone: makeContactPhone(),
      isBusiness: false,
    })

    expect(contact).toBeTruthy()
  })
})
