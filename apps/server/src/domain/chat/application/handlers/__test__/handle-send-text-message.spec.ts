import { FakeChatEmitter } from '@/test/emitters/fake-chat-emitter'
import { FakeMessageEmitter } from '@/test/emitters/fake-message-emitter'
import { makeAttendant } from '@/test/factories/make-attendant'
import { makeChat } from '@/test/factories/make-chat'
import { makeMessage } from '@/test/factories/make-message'
import { makeUniqueEntityID } from '@/test/factories/make-unique-entity-id'
import { makeWhatsApp } from '@/test/factories/make-whats-app'
import { InMemoryAttendantProfilesRepository } from '@/test/repositories/in-memory-attendant-profiles-repository'
import { InMemoryAttendantsRepository } from '@/test/repositories/in-memory-attendants-repository'
import { InMemoryChatsRepository } from '@/test/repositories/in-memory-chats-repository'
import { InMemoryMessagesRepository } from '@/test/repositories/in-memory-messages-repository'
import { faker } from '@faker-js/faker'
import { HandleSendTextMessage } from '../handle-send-text-message'
import { FakeWAClientManager } from '@/test/services/fake-wa-client-manager'
import { FakeWAClient } from '@/test/services/fake-wa-client-manager/clients/fake-wa-client'

let inMemoryMessagesRepository: InMemoryMessagesRepository
let inMemoryChatsRepository: InMemoryChatsRepository
let inMemoryAttendantProfilesRepository: InMemoryAttendantProfilesRepository
let inMemoryAttendantsRepository: InMemoryAttendantsRepository
let fakeWAClientManager: FakeWAClientManager
let fakeMessageEmitter: FakeMessageEmitter
let fakeChatEmitter: FakeChatEmitter

let sut: HandleSendTextMessage

describe('HandleSendTextMessage', () => {
  beforeEach(() => {
    inMemoryMessagesRepository = new InMemoryMessagesRepository()
    inMemoryChatsRepository = new InMemoryChatsRepository()
    inMemoryAttendantProfilesRepository =
      new InMemoryAttendantProfilesRepository()
    inMemoryAttendantsRepository = new InMemoryAttendantsRepository(
      inMemoryAttendantProfilesRepository,
    )
    fakeWAClientManager = new FakeWAClientManager()
    fakeMessageEmitter = new FakeMessageEmitter()
    fakeChatEmitter = new FakeChatEmitter()

    sut = new HandleSendTextMessage(
      inMemoryMessagesRepository,
      inMemoryChatsRepository,
      inMemoryAttendantsRepository,
      fakeWAClientManager,
      fakeMessageEmitter,
      fakeChatEmitter,
    )
  })

  it('should be able to create message from send text', async () => {
    const whatsAppId = makeUniqueEntityID()
    const whatsApp = makeWhatsApp({ status: 'connected' }, whatsAppId)

    const fakeWAClient = FakeWAClient.createFromWhatsApp(whatsApp)
    fakeWAClientManager.clients.set(whatsAppId.toString(), fakeWAClient)

    const attendant = makeAttendant()
    inMemoryAttendantsRepository.items.push(attendant)

    const chat = makeChat({ whatsAppId })
    inMemoryChatsRepository.items.push(chat)

    const response = await sut.execute({
      attendantId: attendant.id.toString(),
      body: faker.lorem.paragraph(),
      waChatId: chat.waChatId.toString(),
      whatsAppId: whatsAppId.toString(),
    })

    expect(response.isRight()).toBe(true)
    if (response.isLeft()) return

    const { message } = response.value

    expect(message.ack).toBe('sent')
    expect(inMemoryMessagesRepository.items).toHaveLength(1)

    expect(fakeMessageEmitter.payloads).toHaveLength(2)
    expect(fakeChatEmitter.payloads).toHaveLength(2)
    expect(fakeWAClient.message.messages).toHaveLength(1)
  })

  it('should be able to create message from send text quoting other message', async () => {
    const whatsAppId = makeUniqueEntityID()
    const whatsApp = makeWhatsApp({ status: 'connected' }, whatsAppId)

    const fakeWAClient = FakeWAClient.createFromWhatsApp(whatsApp)
    fakeWAClientManager.clients.set(whatsAppId.toString(), fakeWAClient)

    const attendant = makeAttendant()
    inMemoryAttendantsRepository.items.push(attendant)

    const chat = makeChat({ whatsAppId })
    inMemoryChatsRepository.items.push(chat)

    const quotedMessage = makeMessage({
      chatId: chat.id,
      waChatId: chat.waChatId,
      whatsAppId,
    })
    inMemoryMessagesRepository.items.push(quotedMessage)

    const response = await sut.execute({
      attendantId: attendant.id.toString(),
      body: faker.lorem.paragraph(),
      waChatId: chat.waChatId.toString(),
      quotedId: quotedMessage.id.toString(),
      whatsAppId: whatsAppId.toString(),
    })

    expect(response.isRight()).toBe(true)
    if (response.isLeft()) return

    const { message } = response.value

    expect(message.hasQuoted()).toBe(true)
    expect(inMemoryMessagesRepository.items).toHaveLength(2)
  })
})
