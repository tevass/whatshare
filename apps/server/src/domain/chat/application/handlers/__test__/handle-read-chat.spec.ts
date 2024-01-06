import { FakeChatEmitter } from '@/test/emitters/fake-chat-emitter'
import { makeChat } from '@/test/factories/make-chat'
import { makeUniqueEntityID } from '@/test/factories/make-unique-entity-id'
import { makeWAEntityID } from '@/test/factories/make-wa-entity-id'
import { InMemoryChatsRepository } from '@/test/repositories/in-memory-chats-repository'
import {
  FakeWAClientServices,
  FakeWAService,
} from '@/test/services/fake-wa-service'
import { HandleReadChat } from '../handle-read-chat'

let inMemoryChatsRepository: InMemoryChatsRepository
let fakeWAService: FakeWAService
let fakeChatEmitter: FakeChatEmitter

let sut: HandleReadChat

describe('HandleReadChat', () => {
  beforeEach(() => {
    inMemoryChatsRepository = new InMemoryChatsRepository()
    fakeWAService = new FakeWAService()
    fakeChatEmitter = new FakeChatEmitter()

    sut = new HandleReadChat(
      inMemoryChatsRepository,
      fakeWAService,
      fakeChatEmitter,
    )
  })

  it('should be able to set chat read', async () => {
    const whatsAppId = makeUniqueEntityID()

    const fakeWAClientServices = FakeWAClientServices.create(whatsAppId)
    fakeWAService.clients.set(whatsAppId.toString(), fakeWAClientServices)

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
    expect(fakeWAClientServices.chat.values).toHaveLength(1)
  })
})
