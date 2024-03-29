import { FakeChatEmitter } from '@/test/emitters/fake-chat-emitter'
import { makeUniqueEntityID } from '@/test/factories/make-unique-entity-id'
import { makeWAEntityID } from '@/test/factories/make-wa-entity-id'
import { makeWhatsApp } from '@/test/factories/make-whats-app'
import { InMemoryChatsRepository } from '@/test/repositories/in-memory-chats-repository'
import { HandleUnreadChat } from '../handle-unread-chat'
import { FakeWAClientManager } from '@/test/services/fake-wa-client-manager'
import { FakeWAClient } from '@/test/services/fake-wa-client-manager/clients/fake-wa-client'
import { makePrivateChat } from '@/test/factories/make-private-chat'

let inMemoryChatsRepository: InMemoryChatsRepository
let fakeWAClientManager: FakeWAClientManager
let fakeChatEmitter: FakeChatEmitter

let sut: HandleUnreadChat

describe('HandleUnreadChat', () => {
  beforeEach(() => {
    inMemoryChatsRepository = new InMemoryChatsRepository()
    fakeWAClientManager = new FakeWAClientManager()
    fakeChatEmitter = new FakeChatEmitter()

    sut = new HandleUnreadChat(
      inMemoryChatsRepository,
      fakeWAClientManager,
      fakeChatEmitter,
    )
  })

  it('should be able to set chat unread', async () => {
    const whatsAppId = makeUniqueEntityID()
    const whatsApp = makeWhatsApp({ status: 'connected' }, whatsAppId)

    const fakeWAClient = FakeWAClient.createFromWhatsApp(whatsApp)
    fakeWAClientManager.clients.set(whatsAppId.toString(), fakeWAClient)

    const waChatId = makeWAEntityID()
    inMemoryChatsRepository.items.push(
      makePrivateChat({ whatsAppId, waChatId }),
    )

    const response = await sut.execute({
      waChatId: waChatId.toString(),
      whatsAppId: whatsAppId.toString(),
    })

    expect(response.isRight()).toBe(true)
    if (response.isLeft()) return

    const { chat } = response.value

    expect(chat.unreadCount).toBe(-1)
    expect(inMemoryChatsRepository.items[0]).toBe(chat)
    expect(fakeChatEmitter.payloads).toHaveLength(1)
    expect(fakeWAClient.chat.values).toHaveLength(1)
  })
})
