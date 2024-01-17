import { FakeChatEmitter } from '@/test/emitters/fake-chat-emitter'
import { makeChat } from '@/test/factories/make-chat'
import { makeMessage } from '@/test/factories/make-message'
import { makeUniqueEntityID } from '@/test/factories/make-unique-entity-id'
import { makeWAEntityID } from '@/test/factories/make-wa-entity-id'
import { InMemoryChatsRepository } from '@/test/repositories/in-memory-chats-repository'
import { InMemoryMessagesRepository } from '@/test/repositories/in-memory-messages-repository'
import { FakeWAClient, FakeWAService } from '@/test/services/fake-wa-service'
import { HandleClearChat } from '../handle-clear-chat'

let inMemoryChatsRepository: InMemoryChatsRepository
let inMemoryMessagesRepository: InMemoryMessagesRepository
let fakeWAService: FakeWAService
let fakeChatEmitter: FakeChatEmitter

let sut: HandleClearChat

describe('HandleClearChat', () => {
  beforeEach(() => {
    inMemoryChatsRepository = new InMemoryChatsRepository()
    inMemoryMessagesRepository = new InMemoryMessagesRepository()
    fakeWAService = new FakeWAService()
    fakeChatEmitter = new FakeChatEmitter()

    sut = new HandleClearChat(
      inMemoryChatsRepository,
      inMemoryMessagesRepository,
      fakeWAService,
      fakeChatEmitter,
    )
  })

  it('should be able to clear chat', async () => {
    const whatsAppId = makeUniqueEntityID()

    const fakeWAClient = FakeWAClient.create(whatsAppId)
    fakeWAService.clients.set(whatsAppId.toString(), fakeWAClient)

    const waChatId = makeWAEntityID()
    inMemoryChatsRepository.items.push(makeChat({ whatsAppId, waChatId }))

    const response = await sut.execute({
      waChatId: waChatId.toString(),
      whatsAppId: whatsAppId.toString(),
    })

    expect(response.isRight()).toBe(true)
    if (response.isLeft()) return

    const { chat } = response.value

    expect(chat).toEqual(
      expect.objectContaining({
        unreadCount: 0,
        lastMessage: null,
        deletedAt: expect.any(Date),
      }),
    )

    expect(inMemoryChatsRepository.items[0]).toBe(chat)
    expect(fakeChatEmitter.events).toHaveLength(1)
    expect(fakeWAClient.chat.values).toHaveLength(1)
  })

  it('should be able to update messages from chat', async () => {
    const whatsAppId = makeUniqueEntityID()

    const fakeWAClient = FakeWAClient.create(whatsAppId)
    fakeWAService.clients.set(whatsAppId.toString(), fakeWAClient)

    const waChatId = makeWAEntityID()
    const chat = makeChat({ whatsAppId, waChatId })
    inMemoryChatsRepository.items.push(chat)

    const messages = Array.from(Array(3)).map(() =>
      makeMessage({ whatsAppId, chatId: chat.id }),
    )
    inMemoryMessagesRepository.items.push(...messages)

    const response = await sut.execute({
      waChatId: waChatId.toString(),
      whatsAppId: whatsAppId.toString(),
    })

    expect(response.isRight()).toBe(true)

    expect(inMemoryMessagesRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          deletedAt: expect.any(Date),
        }),
      ]),
    )
  })
})
