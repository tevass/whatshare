import { FakeChatEmitter } from '@/test/emitters/fake-chat-emitter'
import { FakeMessageEmitter } from '@/test/emitters/fake-message-emitter'
import { makeAttendant } from '@/test/factories/make-attendant'
import { makeChat } from '@/test/factories/make-chat'
import { makeMessage } from '@/test/factories/make-message'
import { makeUniqueEntityID } from '@/test/factories/make-unique-entity-id'
import { InMemoryAttendantsRepository } from '@/test/repositories/in-memory-attendants-repository'
import { InMemoryChatsRepository } from '@/test/repositories/in-memory-chats-repository'
import { InMemoryMessagesRepository } from '@/test/repositories/in-memory-messages-repository'
import {
  FakeWAClientServices,
  FakeWAService,
} from '@/test/services/fake-wa-service'
import { faker } from '@faker-js/faker'
import { HandleSendTextMessage } from '../handle-send-text-message'

let inMemoryMessagesRepository: InMemoryMessagesRepository
let inMemoryChatsRepository: InMemoryChatsRepository
let inMemoryAttendantsRepository: InMemoryAttendantsRepository
let fakeWAService: FakeWAService
let fakeMessageEmitter: FakeMessageEmitter
let fakeChatEmitter: FakeChatEmitter

let sut: HandleSendTextMessage

describe('HandleSendTextMessage', () => {
  beforeEach(() => {
    inMemoryMessagesRepository = new InMemoryMessagesRepository()
    inMemoryChatsRepository = new InMemoryChatsRepository()
    inMemoryAttendantsRepository = new InMemoryAttendantsRepository()
    fakeWAService = new FakeWAService()
    fakeMessageEmitter = new FakeMessageEmitter()
    fakeChatEmitter = new FakeChatEmitter()

    sut = new HandleSendTextMessage(
      inMemoryMessagesRepository,
      inMemoryChatsRepository,
      inMemoryAttendantsRepository,
      fakeWAService,
      fakeMessageEmitter,
      fakeChatEmitter,
    )
  })

  it('should be able to create message from send text', async () => {
    const whatsAppId = makeUniqueEntityID()

    const fakeWAClientServices = FakeWAClientServices.create(whatsAppId)
    fakeWAService.clients.set(whatsAppId.toString(), fakeWAClientServices)

    const attendant = makeAttendant()
    inMemoryAttendantsRepository.items.push(attendant)

    const chat = makeChat({ whatsAppId })
    inMemoryChatsRepository.items.push(chat)

    const response = await sut.execute({
      attendantId: attendant.id.toString(),
      body: faker.lorem.paragraph(),
      chatId: chat.id.toString(),
    })

    expect(response.isRight()).toBe(true)
    if (response.isLeft()) return

    const { message } = response.value

    expect(message.ack).toBe('sent')
    expect(inMemoryMessagesRepository.items).toHaveLength(1)

    expect(fakeMessageEmitter.events).toHaveLength(2)
    expect(fakeChatEmitter.events).toHaveLength(2)
    expect(fakeWAClientServices.message.messages).toHaveLength(1)
  })

  it('should be able to create message from send text quoting other message', async () => {
    const whatsAppId = makeUniqueEntityID()

    const fakeWAClientServices = FakeWAClientServices.create(whatsAppId)
    fakeWAService.clients.set(whatsAppId.toString(), fakeWAClientServices)

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
      chatId: chat.id.toString(),
      quotedId: quotedMessage.id.toString(),
    })

    expect(response.isRight()).toBe(true)
    if (response.isLeft()) return

    const { message } = response.value

    expect(message.hasQuoted()).toBe(true)
    expect(inMemoryMessagesRepository.items).toHaveLength(2)
  })
})
