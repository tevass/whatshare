import { FakeChatEmitter } from '@/test/emitters/fake-chat-emitter'
import { makeChat } from '@/test/factories/make-chat'
import { makeUniqueEntityID } from '@/test/factories/make-unique-entity-id'
import { InMemoryChatsRepository } from '@/test/repositories/in-memory-chats-repository'
import {
  FakeWAClientServices,
  FakeWAService,
} from '@/test/services/fake-wa-service'
import { HandleUnreadChat } from '../handle-unread-chat'

let inMemoryChatsRepository: InMemoryChatsRepository
let fakeWAService: FakeWAService
let fakeChatEmitter: FakeChatEmitter

let sut: HandleUnreadChat

describe('HandleUnreadChat', () => {
  beforeEach(() => {
    inMemoryChatsRepository = new InMemoryChatsRepository()
    fakeWAService = new FakeWAService()
    fakeChatEmitter = new FakeChatEmitter()

    sut = new HandleUnreadChat(
      inMemoryChatsRepository,
      fakeWAService,
      fakeChatEmitter,
    )
  })

  it('should be able to set chat unread', async () => {
    const whatsAppId = makeUniqueEntityID()

    const fakeWAClientServices = FakeWAClientServices.create(whatsAppId)
    fakeWAService.clients.set(whatsAppId.toString(), fakeWAClientServices)

    const chatId = makeUniqueEntityID()

    inMemoryChatsRepository.items.push(makeChat({ whatsAppId }, chatId))

    const response = await sut.execute({
      chatId: chatId.toString(),
    })

    expect(response.isRight()).toBe(true)
    if (response.isLeft()) return

    const { chat } = response.value

    expect(chat.unreadCount).toBe(-1)
    expect(inMemoryChatsRepository.items[0]).toBe(chat)
    expect(fakeChatEmitter.events).toHaveLength(1)
    expect(fakeWAClientServices.chat.values).toHaveLength(1)
  })
})
