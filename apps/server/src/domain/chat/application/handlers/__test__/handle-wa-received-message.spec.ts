import { FakeChatEmitter } from '@/test/emitters/fake-chat-emitter'
import { FakeMessageEmitter } from '@/test/emitters/fake-message-emitter'
import { makeChat } from '@/test/factories/make-chat'
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

let inMemoryMessagesRepository: InMemoryMessagesRepository
let inMemoryContactsRepository: InMemoryContactsRepository
let inMemoryChatsRepository: InMemoryChatsRepository
let inMemoryMessageMediasRepository: InMemoryMessageMediasRepository
let fakeMessageEmitter: FakeMessageEmitter
let fakeChatEmitter: FakeChatEmitter
let fakeUploader: FakeUploader

let createMessageFromWAMessageUseCase: CreateMessageFromWAMessageUseCase

let sut: HandleWAReceivedMessage

describe('HandleWAReceivedMessage', () => {
  beforeEach(() => {
    inMemoryMessagesRepository = new InMemoryMessagesRepository()
    inMemoryContactsRepository = new InMemoryContactsRepository()
    inMemoryChatsRepository = new InMemoryChatsRepository()
    inMemoryMessageMediasRepository = new InMemoryMessageMediasRepository()
    fakeMessageEmitter = new FakeMessageEmitter()
    fakeChatEmitter = new FakeChatEmitter()
    fakeUploader = new FakeUploader()

    createMessageFromWAMessageUseCase = new CreateMessageFromWAMessageUseCase(
      inMemoryMessagesRepository,
      inMemoryContactsRepository,
      inMemoryChatsRepository,
      inMemoryMessageMediasRepository,
      fakeUploader,
    )

    sut = new HandleWAReceivedMessage(
      inMemoryContactsRepository,
      inMemoryChatsRepository,
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

    const chat = makeChat({ waChatId: waChat.id, contact, whatsAppId })
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
    const waChat = makeWAChat({ waClientId: whatsAppId }, waContact.id)

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
