import { makeWAChat } from '@/test/factories/make-wa-chat'
import { makeWAContact } from '@/test/factories/make-wa-contact'
import { makeWhatsApp } from '@/test/factories/make-whats-app'
import { InMemoryChatsRepository } from '@/test/repositories/in-memory-chats-repository'
import { InMemoryContactsRepository } from '@/test/repositories/in-memory-contacts-repository'
import { InMemoryWhatsAppsRepository } from '@/test/repositories/in-memory-whats-apps-repository'
import { ImportChatsUseCase } from '../import-chats-use-case'
import { FakeWAClientManager } from '@/test/services/fake-wa-client-manager'
import { FakeWAClient } from '@/test/services/fake-wa-client-manager/clients/fake-wa-client'

let inMemoryWhatsAppRepository: InMemoryWhatsAppsRepository
let inMemoryChatsRepository: InMemoryChatsRepository
let inMemoryContactsRepository: InMemoryContactsRepository
let fakeWAClientManager: FakeWAClientManager

let sut: ImportChatsUseCase

describe('ImportChatsUseCase', () => {
  beforeEach(() => {
    inMemoryWhatsAppRepository = new InMemoryWhatsAppsRepository()
    inMemoryChatsRepository = new InMemoryChatsRepository()
    inMemoryContactsRepository = new InMemoryContactsRepository()
    fakeWAClientManager = new FakeWAClientManager()

    sut = new ImportChatsUseCase(
      inMemoryWhatsAppRepository,
      inMemoryChatsRepository,
      inMemoryContactsRepository,
      fakeWAClientManager,
    )
  })

  it('should be able to import chats from wa-client', async () => {
    const whatsApp = makeWhatsApp({ status: 'connected' })
    inMemoryWhatsAppRepository.items.push(whatsApp)

    const fakeWAClient = FakeWAClient.createFromWhatsApp(whatsApp)
    fakeWAClientManager.clients.set(whatsApp.id.toString(), fakeWAClient)

    const waContacts = Array.from(Array(4)).map(() =>
      makeWAContact({ isMyContact: true }),
    )
    inMemoryContactsRepository.items.push(
      ...waContacts.slice(2).map((waContact) => waContact.toContact()),
    )

    const waChats = waContacts.map((contact) => makeWAChat({ contact }))
    fakeWAClient.chat.chats.push(...waChats)

    inMemoryChatsRepository.items.push(
      ...waChats.slice(2).map((waChat) => waChat.toChat()),
    )

    const response = await sut.execute({
      whatsAppId: whatsApp.id.toString(),
    })

    expect(response.isRight()).toBe(true)
    if (response.isLeft()) return

    const { chats } = response.value

    expect(chats).toHaveLength(2)
    expect(inMemoryChatsRepository.items).toHaveLength(4)
    expect(inMemoryContactsRepository.items).toHaveLength(4)
  })
})
