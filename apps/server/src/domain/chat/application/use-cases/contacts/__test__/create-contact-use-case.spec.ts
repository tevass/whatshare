import { InMemoryContactsRepository } from '@/test/repositories/in-memory-contacts-repository'
import { CreateContactUseCase } from '../create-contact-use-case'
import { faker } from '@faker-js/faker'
import { makeContact } from '@/test/factories/make-contact'
import { FakeWAClientManager } from '@/test/services/fake-wa-client-manager'
import { FakeWAClient } from '@/test/services/fake-wa-client-manager/clients/fake-wa-client'
import { makeWhatsApp } from '@/test/factories/make-whats-app'
import { makeWAContact } from '@/test/factories/make-wa-contact'

let inMemoryContactsRepository: InMemoryContactsRepository
let fakeWAClientManager: FakeWAClientManager

let sut: CreateContactUseCase

describe('CreateContactUseCase', () => {
  beforeEach(() => {
    inMemoryContactsRepository = new InMemoryContactsRepository()
    fakeWAClientManager = new FakeWAClientManager()

    sut = new CreateContactUseCase(
      inMemoryContactsRepository,
      fakeWAClientManager,
    )
  })

  it('should be able to create a contact', async () => {
    const response = await sut.execute({
      name: faker.person.firstName(),
      number: faker.helpers.fromRegExp(/[0-9]{13}/),
    })

    expect(response.isRight()).toBe(true)
    expect(inMemoryContactsRepository.items).toHaveLength(1)
    if (response.isLeft()) return

    const { contact } = response.value
    expect(contact.imageUrl).toBe(null)
  })

  it('should be able to update an unknown contact', async () => {
    const unknownContact = makeContact({ isMyContact: false })
    inMemoryContactsRepository.items.push(unknownContact)

    const response = await sut.execute({
      name: faker.person.firstName(),
      number: unknownContact.phone.number,
    })

    expect(response.isRight()).toBe(true)
    expect(inMemoryContactsRepository.items).toHaveLength(1)

    if (response.isLeft()) return

    const { contact } = response.value
    expect(unknownContact.equals(contact)).toBe(true)
  })

  it('should be able to create a contact from wa contact', async () => {
    const waContact = makeWAContact()

    const waClient = FakeWAClient.createFromWhatsApp(makeWhatsApp())
    waClient.contact.contacts.push(waContact)

    fakeWAClientManager.clients.set(waClient.id.toString(), waClient)

    const response = await sut.execute({
      name: faker.person.firstName(),
      number: waContact.number,
    })

    expect(response.isRight()).toBe(true)
    expect(inMemoryContactsRepository.items).toHaveLength(1)

    if (response.isLeft()) return

    const { contact } = response.value
    expect(contact).toEqual(
      expect.objectContaining({
        imageUrl: expect.any(String),
      }),
    )
  })
})
