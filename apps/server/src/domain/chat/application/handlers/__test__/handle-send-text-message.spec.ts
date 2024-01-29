import { FakeChatEmitter } from '@/test/emitters/fake-chat-emitter'
import { FakeMessageEmitter } from '@/test/emitters/fake-message-emitter'
import { makeAttendant } from '@/test/factories/make-attendant'
import { makeChat } from '@/test/factories/make-chat'
import { makeContact } from '@/test/factories/make-contact'
import { makeMessage } from '@/test/factories/make-message'
import { makeUniqueEntityID } from '@/test/factories/make-unique-entity-id'
import { makeWAEntityID } from '@/test/factories/make-wa-entity-id'
import { makeWhatsApp } from '@/test/factories/make-whats-app'
import { InMemoryAttendantProfilesRepository } from '@/test/repositories/in-memory-attendant-profiles-repository'
import { InMemoryAttendantsRepository } from '@/test/repositories/in-memory-attendants-repository'
import { InMemoryChatsRepository } from '@/test/repositories/in-memory-chats-repository'
import { InMemoryContactsRepository } from '@/test/repositories/in-memory-contacts-repository'
import { InMemoryMessagesRepository } from '@/test/repositories/in-memory-messages-repository'
import { FakeWAClientManager } from '@/test/services/fake-wa-client-manager'
import { FakeWAClient } from '@/test/services/fake-wa-client-manager/clients/fake-wa-client'
import { faker } from '@faker-js/faker'
import { HandleSendTextMessage } from '../handle-send-text-message'

let inMemoryMessagesRepository: InMemoryMessagesRepository
let inMemoryChatsRepository: InMemoryChatsRepository
let inMemoryAttendantProfilesRepository: InMemoryAttendantProfilesRepository
let inMemoryAttendantsRepository: InMemoryAttendantsRepository
let inMemoryContactsRepository: InMemoryContactsRepository
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
    inMemoryContactsRepository = new InMemoryContactsRepository()
    fakeWAClientManager = new FakeWAClientManager()
    fakeMessageEmitter = new FakeMessageEmitter()
    fakeChatEmitter = new FakeChatEmitter()

    sut = new HandleSendTextMessage(
      inMemoryMessagesRepository,
      inMemoryChatsRepository,
      inMemoryAttendantsRepository,
      inMemoryContactsRepository,
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

  it('should be able to create chat and message to send text', async () => {
    const whatsAppId = makeUniqueEntityID()
    const whatsApp = makeWhatsApp({ status: 'connected' }, whatsAppId)

    const fakeWAClient = FakeWAClient.createFromWhatsApp(whatsApp)
    fakeWAClientManager.clients.set(whatsAppId.toString(), fakeWAClient)

    const attendant = makeAttendant()
    inMemoryAttendantsRepository.items.push(attendant)

    const contact = makeContact()
    inMemoryContactsRepository.items.push(contact)

    const response = await sut.execute({
      attendantId: attendant.id.toString(),
      body: faker.lorem.paragraph(),
      waChatId: contact.waContactId.toString(),
      whatsAppId: whatsAppId.toString(),
    })

    expect(response.isRight()).toBe(true)
    if (response.isLeft()) return

    const { message } = response.value

    expect(message.ack).toBe('sent')
    expect(inMemoryMessagesRepository.items).toHaveLength(1)
    expect(inMemoryChatsRepository.items).toHaveLength(1)
  })

  it('should be able to create message from send text with wa mentions', async () => {
    const whatsAppId = makeUniqueEntityID()
    const whatsApp = makeWhatsApp({ status: 'connected' }, whatsAppId)

    const fakeWAClient = FakeWAClient.createFromWhatsApp(whatsApp)
    fakeWAClientManager.clients.set(whatsAppId.toString(), fakeWAClient)

    const attendant = makeAttendant()
    inMemoryAttendantsRepository.items.push(attendant)

    const chat = makeChat({ whatsAppId })
    inMemoryChatsRepository.items.push(chat)

    const waMentionsIds = Array.from(Array(3)).map(() => makeWAEntityID())

    const response = await sut.execute({
      attendantId: attendant.id.toString(),
      body: faker.lorem.paragraph(),
      waChatId: chat.waChatId.toString(),
      whatsAppId: whatsAppId.toString(),
      waMentionsIds: waMentionsIds.map((id) => id.toString()),
    })

    expect(response.isRight()).toBe(true)
    if (response.isLeft()) return

    const { message } = response.value
    expect(message.body?.hasMentions()).toBe(true)
  })
})
