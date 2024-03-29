import { FakeChatEmitter } from '@/test/emitters/fake-chat-emitter'
import { makeUniqueEntityID } from '@/test/factories/make-unique-entity-id'
import { makeWAChat } from '@/test/factories/make-wa-chat'
import { InMemoryChatsRepository } from '@/test/repositories/in-memory-chats-repository'
import { HandleWAChangeUnreadCount } from '../handle-wa-change-chat-unread-count'
import { makePrivateChat } from '@/test/factories/make-private-chat'

let inMemoryChatsRepository: InMemoryChatsRepository
let fakeChatEmitter: FakeChatEmitter

let sut: HandleWAChangeUnreadCount

describe('WAChangeChatUnreadHandler', () => {
  beforeEach(() => {
    inMemoryChatsRepository = new InMemoryChatsRepository()
    fakeChatEmitter = new FakeChatEmitter()

    sut = new HandleWAChangeUnreadCount(
      inMemoryChatsRepository,
      fakeChatEmitter,
    )
  })

  it('should be able to change unread count of chat', async () => {
    const whatsAppId = makeUniqueEntityID()

    const waChat = makeWAChat({
      unreadCount: 3,
    })

    inMemoryChatsRepository.items.push(
      makePrivateChat({ waChatId: waChat.id, whatsAppId }),
    )

    const response = await sut.execute({
      waChat,
      whatsAppId: whatsAppId.toString(),
    })

    expect(response.isRight()).toBe(true)
    if (response.isLeft()) return

    const { chat } = response.value
    expect(chat.unreadCount).toBe(3)
    expect(fakeChatEmitter.payloads).toHaveLength(1)
  })
})
