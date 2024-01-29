import { InMemoryContactsRepository } from '@/test/repositories/in-memory-contacts-repository'
import { UpdateContactUseCase } from '../update-contact-use-case'
import { faker } from '@faker-js/faker'
import { makeContact } from '@/test/factories/make-contact'
import { FakeWAClientManager } from '@/test/services/fake-wa-client-manager'
import { FakeWAClient } from '@/test/services/fake-wa-client-manager/clients/fake-wa-client'
import { makeWhatsApp } from '@/test/factories/make-whats-app'
import { makeWAContact } from '@/test/factories/make-wa-contact'
import { WAEntityID } from '@/core/entities/wa-entity-id'

let inMemoryContactsRepository: InMemoryContactsRepository
let fakeWAClientManager: FakeWAClientManager

let sut: UpdateContactUseCase

describe('UpdateContactUseCase', () => {
  beforeEach(() => {
    inMemoryContactsRepository = new InMemoryContactsRepository()
    fakeWAClientManager = new FakeWAClientManager()

    sut = new UpdateContactUseCase(
      inMemoryContactsRepository,
      fakeWAClientManager,
    )
  })

  it('should be able to update a contact', async () => {
    const contact = makeContact()
    inMemoryContactsRepository.items.push(contact)

    const newNumber = faker.helpers.fromRegExp(/[0-9]{13}/)

    const response = await sut.execute({
      contactId: contact.id.toString(),
      name: faker.person.firstName(),
      number: newNumber,
    })

    expect(response.isRight()).toBe(true)
    if (response.isLeft()) return

    expect(response.value.contact).toEqual(
      expect.objectContaining({
        waContactId: new WAEntityID({ ref: newNumber }),
        phone: expect.objectContaining({
          number: newNumber,
        }),
      }),
    )
  })

  it('should be able to update a contact from wa contact', async () => {
    const contact = makeContact({ imageUrl: null })
    inMemoryContactsRepository.items.push(contact)

    const newNumber = faker.helpers.fromRegExp(/[0-9]{13}/)

    const waClient = FakeWAClient.createFromWhatsApp(makeWhatsApp())
    waClient.contact.contacts.push(makeWAContact({}, contact.waContactId))

    fakeWAClientManager.clients.set(waClient.id.toString(), waClient)

    const response = await sut.execute({
      contactId: contact.id.toString(),
      name: faker.person.firstName(),
      number: newNumber,
    })

    expect(response.isRight()).toBe(true)
    if (response.isLeft()) return

    expect(response.value.contact).toEqual(
      expect.objectContaining({
        imageUrl: expect.any(String),
      }),
    )
  })
})
