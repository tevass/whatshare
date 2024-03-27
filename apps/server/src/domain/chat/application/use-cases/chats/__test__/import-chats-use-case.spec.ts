import { makeWAChat } from '@/test/factories/make-wa-chat'
import { makeWAContact } from '@/test/factories/make-wa-contact'
import { makeWhatsApp } from '@/test/factories/make-whats-app'
import { InMemoryChatsRepository } from '@/test/repositories/in-memory-chats-repository'
import { InMemoryContactsRepository } from '@/test/repositories/in-memory-contacts-repository'
import { InMemoryGroupsRepository } from '@/test/repositories/in-memory-groups-repository'
import { InMemoryWhatsAppsRepository } from '@/test/repositories/in-memory-whats-apps-repository'
import { FakeWAClientManager } from '@/test/services/fake-wa-client-manager'
import { FakeWAClient } from '@/test/services/fake-wa-client-manager/clients/fake-wa-client'
import { ImportChatsUseCase } from '../import-chats-use-case'

let inMemoryWhatsAppRepository: InMemoryWhatsAppsRepository
let inMemoryChatsRepository: InMemoryChatsRepository
let inMemoryContactsRepository: InMemoryContactsRepository
let inMemoryGroupsRepository: InMemoryGroupsRepository
let fakeWAClientManager: FakeWAClientManager

let sut: ImportChatsUseCase

describe('ImportChatsUseCase', () => {
  beforeEach(() => {
    inMemoryWhatsAppRepository = new InMemoryWhatsAppsRepository()
    inMemoryChatsRepository = new InMemoryChatsRepository()
    inMemoryContactsRepository = new InMemoryContactsRepository()
    inMemoryGroupsRepository = new InMemoryGroupsRepository()
    fakeWAClientManager = new FakeWAClientManager()

    sut = new ImportChatsUseCase(
      inMemoryWhatsAppRepository,
      inMemoryChatsRepository,
      inMemoryContactsRepository,
      inMemoryGroupsRepository,
      fakeWAClientManager,
    )
  })

  it('should be able to import chats from wa-client', async () => {
    const whatsApp = makeWhatsApp({ status: 'connected' })
    inMemoryWhatsAppRepository.items.push(whatsApp)

    const fakeWAClient = FakeWAClient.createFromWhatsApp(whatsApp)
    fakeWAClientManager.clients.set(whatsApp.id.toString(), fakeWAClient)

    const waContacts = Array.from(Array(2))
      .map(() => makeWAContact({ isMyContact: true, isGroup: false }))
      .concat(
        Array.from(Array(2)).map(() =>
          makeWAContact({ isMyContact: true, isGroup: true }),
        ),
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
    expect(inMemoryContactsRepository.items).toHaveLength(2)
    expect(inMemoryGroupsRepository.items).toHaveLength(2)
  })
})
