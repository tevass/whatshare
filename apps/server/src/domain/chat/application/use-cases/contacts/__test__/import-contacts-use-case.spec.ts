import { makeUniqueEntityID } from '@/test/factories/make-unique-entity-id'
import { makeWAContact } from '@/test/factories/make-wa-contact'
import { makeWhatsApp } from '@/test/factories/make-whats-app'
import { InMemoryContactsRepository } from '@/test/repositories/in-memory-contacts-repository'
import { InMemoryWhatsAppsRepository } from '@/test/repositories/in-memory-whats-apps-repository'
import { FakeWAClientManager } from '@/test/services/fake-wa-client-manager'
import { FakeWAClient } from '@/test/services/fake-wa-client-manager/clients/fake-wa-client'
import { ImportContactsUseCase } from '../import-contacts-use-case'

let inMemoryWhatsAppRepository: InMemoryWhatsAppsRepository
let inMemoryContactsRepository: InMemoryContactsRepository
let fakeWAClientManager: FakeWAClientManager

let sut: ImportContactsUseCase

describe('ImportContactsUseCase', () => {
  beforeEach(() => {
    inMemoryWhatsAppRepository = new InMemoryWhatsAppsRepository()
    inMemoryContactsRepository = new InMemoryContactsRepository()
    fakeWAClientManager = new FakeWAClientManager()

    sut = new ImportContactsUseCase(
      inMemoryWhatsAppRepository,
      inMemoryContactsRepository,
      fakeWAClientManager,
    )
  })

  it('should be able to import contacts from wa-client', async () => {
    const whatsAppId = makeUniqueEntityID()
    const whatsApp = makeWhatsApp({ status: 'connected' }, whatsAppId)
    inMemoryWhatsAppRepository.items.push(whatsApp)

    const fakeWAClient = FakeWAClient.createFromWhatsApp(whatsApp)
    fakeWAClientManager.clients.set(whatsApp.id.toString(), fakeWAClient)

    const waContacts = Array.from(Array(4)).map(() =>
      makeWAContact({ isGroup: false }),
    )
    fakeWAClient.contact.contacts.push(...waContacts)

    inMemoryContactsRepository.items.push(
      ...waContacts.slice(2).map((waContact) => waContact.toContact()),
    )

    const response = await sut.execute({
      whatsAppId: whatsApp.id.toString(),
    })

    expect(response.isRight()).toBe(true)
    if (response.isLeft()) return

    const { contacts } = response.value

    expect(contacts).toHaveLength(2)
    expect(inMemoryContactsRepository.items).toHaveLength(4)
  })
})
