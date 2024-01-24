import { FakeChatEmitter } from '@/test/emitters/fake-chat-emitter'
import { makeChat } from '@/test/factories/make-chat'
import { makeMessage } from '@/test/factories/make-message'
import { makeUniqueEntityID } from '@/test/factories/make-unique-entity-id'
import { makeWAEntityID } from '@/test/factories/make-wa-entity-id'
import { makeWhatsApp } from '@/test/factories/make-whats-app'
import { InMemoryChatsRepository } from '@/test/repositories/in-memory-chats-repository'
import { InMemoryMessagesRepository } from '@/test/repositories/in-memory-messages-repository'
import { HandleClearChat } from '../handle-clear-chat'
import { FakeWAClientManager } from '@/test/services/fake-wa-client-manager'
import { FakeWAClient } from '@/test/services/fake-wa-client-manager/clients/fake-wa-client'

let inMemoryChatsRepository: InMemoryChatsRepository
let inMemoryMessagesRepository: InMemoryMessagesRepository
let fakeWAClientManager: FakeWAClientManager
let fakeChatEmitter: FakeChatEmitter

let sut: HandleClearChat

describe('HandleClearChat', () => {
  beforeEach(() => {
    inMemoryChatsRepository = new InMemoryChatsRepository()
    inMemoryMessagesRepository = new InMemoryMessagesRepository()
    fakeWAClientManager = new FakeWAClientManager()
    fakeChatEmitter = new FakeChatEmitter()

    sut = new HandleClearChat(
      inMemoryChatsRepository,
      inMemoryMessagesRepository,
      fakeWAClientManager,
      fakeChatEmitter,
    )
  })

  it('should be able to clear chat', async () => {
    const whatsAppId = makeUniqueEntityID()
    const whatsApp = makeWhatsApp({ status: 'connected' }, whatsAppId)

    const fakeWAClient = FakeWAClient.createFromWhatsApp(whatsApp)
    fakeWAClientManager.clients.set(whatsAppId.toString(), fakeWAClient)

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
    expect(fakeChatEmitter.payloads).toHaveLength(1)
    expect(fakeWAClient.chat.values).toHaveLength(1)
  })

  it('should be able to update messages from chat', async () => {
    const whatsAppId = makeUniqueEntityID()
    const whatsApp = makeWhatsApp({ status: 'connected' }, whatsAppId)

    const fakeWAClient = FakeWAClient.createFromWhatsApp(whatsApp)
    fakeWAClientManager.clients.set(whatsAppId.toString(), fakeWAClient)

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
