import { FakeDateAdapter } from '@/test/adapters/fake-date-adapter'
import { FakeChatEmitter } from '@/test/emitters/fake-chat-emitter'
import { FakeMessageEmitter } from '@/test/emitters/fake-message-emitter'
import { makeUniqueEntityID } from '@/test/factories/make-unique-entity-id'
import { makeWAChat } from '@/test/factories/make-wa-chat'
import { makeWAContact } from '@/test/factories/make-wa-contact'
import { makeWAMessage } from '@/test/factories/make-wa-message'
import { InMemoryChatsRepository } from '@/test/repositories/in-memory-chats-repository'
import { InMemoryContactsRepository } from '@/test/repositories/in-memory-contacts-repository'
import { InMemoryMessageMediasRepository } from '@/test/repositories/in-memory-message-medias-repository'
import { InMemoryMessagesRepository } from '@/test/repositories/in-memory-messages-repository'
import { FakeUploader } from '@/test/storage/fake-uploader'
import { CreateMessageFromWAMessageUseCase } from '../../use-cases/messages/create-message-from-wa-message-use-case'
import { HandleWAReceivedMessage } from '../handle-wa-received-message'
import { CreateContactsFromWaContactsUseCase } from '../../use-cases/contacts/create-contacts-from-wa-contacts-use-case'
import { makePrivateChat } from '@/test/factories/make-private-chat'
import { CreateChatFromWaChatUseCase } from '../../use-cases/chats/create-chat-from-wa-chat-use-case'

let inMemoryMessagesRepository: InMemoryMessagesRepository
let inMemoryContactsRepository: InMemoryContactsRepository
let inMemoryChatsRepository: InMemoryChatsRepository
let inMemoryMessageMediasRepository: InMemoryMessageMediasRepository
let fakeMessageEmitter: FakeMessageEmitter
let fakeChatEmitter: FakeChatEmitter
let fakeUploader: FakeUploader
let fakeDateAdapter: FakeDateAdapter

let createContactsFromWaContacts: CreateContactsFromWaContactsUseCase
let createChatFromWAChat: CreateChatFromWaChatUseCase
let createMessageFromWAMessageUseCase: CreateMessageFromWAMessageUseCase

let sut: HandleWAReceivedMessage

describe('HandleWAReceivedMessage', () => {
  beforeEach(() => {
    inMemoryMessagesRepository = new InMemoryMessagesRepository()
    inMemoryContactsRepository = new InMemoryContactsRepository()
    inMemoryChatsRepository = new InMemoryChatsRepository()
    inMemoryMessageMediasRepository = new InMemoryMessageMediasRepository(
      inMemoryMessagesRepository,
    )
    fakeMessageEmitter = new FakeMessageEmitter()
    fakeChatEmitter = new FakeChatEmitter()
    fakeUploader = new FakeUploader()
    fakeDateAdapter = new FakeDateAdapter()

    createContactsFromWaContacts = new CreateContactsFromWaContactsUseCase(
      inMemoryContactsRepository,
    )

    createChatFromWAChat = new CreateChatFromWaChatUseCase(
      inMemoryContactsRepository,
      inMemoryChatsRepository,
      createContactsFromWaContacts,
    )

    createMessageFromWAMessageUseCase = new CreateMessageFromWAMessageUseCase(
      inMemoryMessagesRepository,
      inMemoryChatsRepository,
      inMemoryMessageMediasRepository,
      createContactsFromWaContacts,
      fakeUploader,
      fakeDateAdapter,
    )

    sut = new HandleWAReceivedMessage(
      inMemoryContactsRepository,
      inMemoryChatsRepository,
      createChatFromWAChat,
      createMessageFromWAMessageUseCase,
      fakeMessageEmitter,
      fakeChatEmitter,
    )
  })

  it('should be able to create a received message', async () => {
    const whatsAppId = makeUniqueEntityID()

    const waContact = makeWAContact({ isMyContact: true })
    const waChat = makeWAChat({ waClientId: whatsAppId }, waContact.id)

    const waMessage = makeWAMessage()

    const contact = waContact.toContact()
    inMemoryContactsRepository.items.push(contact)

    const chat = makePrivateChat({ waChatId: waChat.id, contact, whatsAppId })
    inMemoryChatsRepository.items.push(chat)

    const response = await sut.execute({
      waChat,
      waMessage,
      whatsAppId: whatsAppId.toString(),
    })

    expect(response.isRight()).toBe(true)
    expect(inMemoryMessagesRepository.items).toHaveLength(1)
    expect(fakeMessageEmitter.payloads).toHaveLength(1)
    expect(fakeChatEmitter.payloads).toHaveLength(1)
  })

  it('should be able to create a contact and chat from received message', async () => {
    const whatsAppId = makeUniqueEntityID()

    const waContact = makeWAContact()
    const waChat = makeWAChat(
      { waClientId: whatsAppId, isGroup: false },
      waContact.id,
    )

    const waMessage = makeWAMessage()

    const response = await sut.execute({
      waChat,
      waMessage,
      whatsAppId: whatsAppId.toString(),
    })

    expect(response.isRight()).toBe(true)

    expect(inMemoryContactsRepository.items).toHaveLength(1)
    expect(inMemoryChatsRepository.items).toHaveLength(1)
    expect(inMemoryMessagesRepository.items).toHaveLength(1)
    expect(fakeChatEmitter.payloads).toHaveLength(2)
  })
})
