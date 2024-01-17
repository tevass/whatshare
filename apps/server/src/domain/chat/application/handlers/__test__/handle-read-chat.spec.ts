import { FakeChatEmitter } from '@/test/emitters/fake-chat-emitter'
import { makeChat } from '@/test/factories/make-chat'
import { makeUniqueEntityID } from '@/test/factories/make-unique-entity-id'
import { makeWAEntityID } from '@/test/factories/make-wa-entity-id'
import { InMemoryChatsRepository } from '@/test/repositories/in-memory-chats-repository'
import { HandleReadChat } from '../handle-read-chat'
import { makeWhatsApp } from '@/test/factories/make-whats-app'
import { FakeWAServiceManager } from '@/test/services/fake-wa-service-manager'
import { FakeWAService } from '@/test/services/fake-wa-service'

let inMemoryChatsRepository: InMemoryChatsRepository
let fakeWAServiceManager: FakeWAServiceManager
let fakeChatEmitter: FakeChatEmitter

let sut: HandleReadChat

describe('HandleReadChat', () => {
  beforeEach(() => {
    inMemoryChatsRepository = new InMemoryChatsRepository()
    fakeWAServiceManager = new FakeWAServiceManager()
    fakeChatEmitter = new FakeChatEmitter()

    sut = new HandleReadChat(
      inMemoryChatsRepository,
      fakeWAServiceManager,
      fakeChatEmitter,
    )
  })

  it('should be able to set chat read', async () => {
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

    expect(chat.unreadCount).toBe(0)
    expect(inMemoryChatsRepository.items[0]).toBe(chat)
    expect(fakeChatEmitter.events).toHaveLength(1)
    expect(fakeWAService.chat.values).toHaveLength(1)
  })
})
