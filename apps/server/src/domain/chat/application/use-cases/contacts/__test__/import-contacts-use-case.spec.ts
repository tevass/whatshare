import { makeWAContact } from '@/test/factories/make-wa-contact'
import { makeWhatsApp } from '@/test/factories/make-whats-app'
import { InMemoryContactsRepository } from '@/test/repositories/in-memory-contacts-repository'
import { InMemoryWhatsAppsRepository } from '@/test/repositories/in-memory-whats-apps-repository'
import { FakeWAClient, FakeWAService } from '@/test/services/fake-wa-service'
import { ImportContactsUseCase } from '../import-contacts-use-case'

let inMemoryWhatsAppRepository: InMemoryWhatsAppsRepository
let inMemoryContactsRepository: InMemoryContactsRepository
let fakeWAService: FakeWAService

let sut: ImportContactsUseCase

describe('ImportContactsUseCase', () => {
  beforeEach(() => {
    inMemoryWhatsAppRepository = new InMemoryWhatsAppsRepository()
    inMemoryContactsRepository = new InMemoryContactsRepository()
    fakeWAService = new FakeWAService()

    sut = new ImportContactsUseCase(
      inMemoryWhatsAppRepository,
      inMemoryContactsRepository,
      fakeWAService,
    )
  })

  it('should be able to import contacts from wa-client', async () => {
    const whatsApp = makeWhatsApp()
    inMemoryWhatsAppRepository.items.push(whatsApp)

    const fakeWAClient = FakeWAClient.create(whatsApp.id)
    fakeWAService.clients.set(whatsApp.id.toString(), fakeWAClient)

    const waContacts = Array.from(Array(4)).map(() => makeWAContact())
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
