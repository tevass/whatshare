import { FakeChatEmitter } from '@/test/emitters/fake-chat-emitter'
import { makeChat } from '@/test/factories/make-chat'
import { makeUniqueEntityID } from '@/test/factories/make-unique-entity-id'
import { makeWAEntityID } from '@/test/factories/make-wa-entity-id'
import { makeWhatsApp } from '@/test/factories/make-whats-app'
import { InMemoryChatsRepository } from '@/test/repositories/in-memory-chats-repository'
import { FakeWAService } from '@/test/services/fake-wa-service'
import { FakeWAServiceManager } from '@/test/services/fake-wa-service-manager'
import { HandleUnreadChat } from '../handle-unread-chat'

let inMemoryChatsRepository: InMemoryChatsRepository
let fakeWAServiceManager: FakeWAServiceManager
let fakeChatEmitter: FakeChatEmitter

let sut: HandleUnreadChat

describe('HandleUnreadChat', () => {
  beforeEach(() => {
    inMemoryChatsRepository = new InMemoryChatsRepository()
    fakeWAServiceManager = new FakeWAServiceManager()
    fakeChatEmitter = new FakeChatEmitter()

    sut = new HandleUnreadChat(
      inMemoryChatsRepository,
      fakeWAServiceManager,
      fakeChatEmitter,
    )
  })

  it('should be able to set chat unread', async () => {
    const whatsAppId = makeUniqueEntityID()
    const whatsApp = makeWhatsApp({ status: 'connected' }, whatsAppId)

    const fakeWAService = FakeWAService.createFromWhatsApp(whatsApp)
    fakeWAServiceManager.services.set(whatsAppId.toString(), fakeWAService)

    const waChatId = makeWAEntityID()
    inMemoryChatsRepository.items.push(makeChat({ whatsAppId, waChatId }))

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
    expect(fakeWAService.chat.values).toHaveLength(1)
  })
})
