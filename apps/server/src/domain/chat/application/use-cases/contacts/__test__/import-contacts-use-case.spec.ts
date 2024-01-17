import { makeWAContact } from '@/test/factories/make-wa-contact'
import { makeWhatsApp } from '@/test/factories/make-whats-app'
import { InMemoryContactsRepository } from '@/test/repositories/in-memory-contacts-repository'
import { InMemoryWhatsAppsRepository } from '@/test/repositories/in-memory-whats-apps-repository'
import { ImportContactsUseCase } from '../import-contacts-use-case'
import { makeUniqueEntityID } from '@/test/factories/make-unique-entity-id'
import { FakeWAServiceManager } from '@/test/services/fake-wa-service-manager'
import { FakeWAService } from '@/test/services/fake-wa-service'

let inMemoryWhatsAppRepository: InMemoryWhatsAppsRepository
let inMemoryContactsRepository: InMemoryContactsRepository
let fakeWAServiceManager: FakeWAServiceManager

let sut: ImportContactsUseCase

describe('ImportContactsUseCase', () => {
  beforeEach(() => {
    inMemoryWhatsAppRepository = new InMemoryWhatsAppsRepository()
    inMemoryContactsRepository = new InMemoryContactsRepository()
    fakeWAServiceManager = new FakeWAServiceManager()

    sut = new ImportContactsUseCase(
      inMemoryWhatsAppRepository,
      inMemoryContactsRepository,
      fakeWAServiceManager,
    )
  })

  it('should be able to import contacts from wa-client', async () => {
    const whatsAppId = makeUniqueEntityID()
    const whatsApp = makeWhatsApp({ status: 'connected' }, whatsAppId)
    inMemoryWhatsAppRepository.items.push(whatsApp)

    const fakeWAService = FakeWAService.createFromWhatsApp(whatsApp)
    fakeWAServiceManager.services.set(whatsApp.id.toString(), fakeWAService)

    const waContacts = Array.from(Array(4)).map(() => makeWAContact())
    fakeWAService.contact.contacts.push(...waContacts)

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
