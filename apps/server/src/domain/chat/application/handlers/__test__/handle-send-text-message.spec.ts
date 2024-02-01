import { FakeChatEmitter } from '@/test/emitters/fake-chat-emitter'
import { FakeMessageEmitter } from '@/test/emitters/fake-message-emitter'
import { makeAttendant } from '@/test/factories/make-attendant'
import { makeContact } from '@/test/factories/make-contact'
import { makeUniqueEntityID } from '@/test/factories/make-unique-entity-id'
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
import { makePrivateChat } from '@/test/factories/make-private-chat'
import { makePrivateMessage } from '@/test/factories/make-private-message'
import { makeGroupChat } from '@/test/factories/make-group-chat'
import { isPrivateMessage } from '@/domain/chat/enterprise/types/message'
import { makeWAChat } from '@/test/factories/make-wa-chat'
import { CreateContactsFromWaContactsUseCase } from '../../use-cases/contacts/create-contacts-from-wa-contacts-use-case'
import { CreateChatFromWaChatUseCase } from '../../use-cases/chats/create-chat-from-wa-chat-use-case'

let inMemoryMessagesRepository: InMemoryMessagesRepository
let inMemoryChatsRepository: InMemoryChatsRepository
let inMemoryAttendantProfilesRepository: InMemoryAttendantProfilesRepository
let inMemoryAttendantsRepository: InMemoryAttendantsRepository
let inMemoryContactsRepository: InMemoryContactsRepository
let fakeWAClientManager: FakeWAClientManager
let fakeMessageEmitter: FakeMessageEmitter
let fakeChatEmitter: FakeChatEmitter

let createChatFromWAChat: CreateChatFromWaChatUseCase
let createContactsFromWaContacts: CreateContactsFromWaContactsUseCase

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

    createContactsFromWaContacts = new CreateContactsFromWaContactsUseCase(
      inMemoryContactsRepository,
    )

    createChatFromWAChat = new CreateChatFromWaChatUseCase(
      inMemoryContactsRepository,
      inMemoryChatsRepository,
      createContactsFromWaContacts,
    )

    sut = new HandleSendTextMessage(
      inMemoryMessagesRepository,
      inMemoryChatsRepository,
      inMemoryAttendantsRepository,
      inMemoryContactsRepository,
      createChatFromWAChat,
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

    const chat = makePrivateChat({ whatsAppId })
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

    const chat = makePrivateChat({ whatsAppId })
    inMemoryChatsRepository.items.push(chat)

    const quotedMessage = makePrivateMessage({
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

    fakeWAClient.chat.chats.push(
      makeWAChat({ waClientId: whatsAppId }, contact.waContactId),
    )

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

    const chat = makeGroupChat({ whatsAppId })
    inMemoryChatsRepository.items.push(chat)

    const contacts = Array.from(Array(3)).map(() => makeContact())
    inMemoryContactsRepository.items.push(...contacts)

    const response = await sut.execute({
      attendantId: attendant.id.toString(),
      body: faker.lorem.paragraph(),
      waChatId: chat.waChatId.toString(),
      whatsAppId: whatsAppId.toString(),
      waMentionsIds: contacts.map((contact) => contact.waContactId.toString()),
    })

    expect(response.isRight()).toBe(true)
    if (response.isLeft()) return

    const { message } = response.value
    if (isPrivateMessage(message)) return

    expect(message.hasMentions()).toBe(true)
  })
})
