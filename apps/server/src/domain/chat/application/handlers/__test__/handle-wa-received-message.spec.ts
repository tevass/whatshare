import { FakeDateAdapter } from '@/test/adapters/fake-date-adapter'
import { FakeChatEmitter } from '@/test/emitters/fake-chat-emitter'
import { FakeMessageEmitter } from '@/test/emitters/fake-message-emitter'
import { makeChat } from '@/test/factories/make-chat'
import { makeContact } from '@/test/factories/make-contact'
import { makeMessage } from '@/test/factories/make-message'
import { makeUniqueEntityID } from '@/test/factories/make-unique-entity-id'
import { makeWAChat } from '@/test/factories/make-wa-chat'
import { makeWAContact } from '@/test/factories/make-wa-contact'
import { makeWAMessage } from '@/test/factories/make-wa-message'
import { makeWAMessageMedia } from '@/test/factories/value-objects/make-wa-message-media'
import { InMemoryChatsRepository } from '@/test/repositories/in-memory-chats-repository'
import { InMemoryContactsRepository } from '@/test/repositories/in-memory-contacts-repository'
import { InMemoryMessageMediasRepository } from '@/test/repositories/in-memory-message-medias-repository'
import { InMemoryMessagesRepository } from '@/test/repositories/in-memory-messages-repository'
import { FakeUploader } from '@/test/storage/fake-uploader'
import { HandleWAReceivedMessage } from '../handle-wa-received-message'

let inMemoryMessagesRepository: InMemoryMessagesRepository
let inMemoryContactsRepository: InMemoryContactsRepository
let inMemoryChatsRepository: InMemoryChatsRepository
let inMemoryMessageMediasRepository: InMemoryMessageMediasRepository
let fakeMessageEmitter: FakeMessageEmitter
let fakeChatEmitter: FakeChatEmitter
let fakeDateAdapter: FakeDateAdapter
let fakeUploader: FakeUploader

let sut: HandleWAReceivedMessage

describe('HandleWAReceivedMessage', () => {
  beforeEach(() => {
    inMemoryMessagesRepository = new InMemoryMessagesRepository()
    inMemoryContactsRepository = new InMemoryContactsRepository()
    inMemoryChatsRepository = new InMemoryChatsRepository()
    inMemoryMessageMediasRepository = new InMemoryMessageMediasRepository()
    fakeMessageEmitter = new FakeMessageEmitter()
    fakeChatEmitter = new FakeChatEmitter()
    fakeDateAdapter = new FakeDateAdapter()
    fakeUploader = new FakeUploader()

    sut = new HandleWAReceivedMessage(
      inMemoryMessagesRepository,
      inMemoryContactsRepository,
      inMemoryChatsRepository,
      inMemoryMessageMediasRepository,
      fakeMessageEmitter,
      fakeChatEmitter,
      fakeDateAdapter,
      fakeUploader,
    )
  })

  it('should be able to create a received message', async () => {
    const whatsAppId = makeUniqueEntityID()

    const waContact = makeWAContact({ isMyContact: true })
    const waChat = makeWAChat({}, waContact.id)

    const waMessage = makeWAMessage()

    const contact = makeContact({
      waContactId: waContact.id,
      isMyContact: true,
    })
    inMemoryContactsRepository.items.push(contact)

    const chat = makeChat({ waChatId: waChat.id, contact, whatsAppId })
    inMemoryChatsRepository.items.push(chat)

    const response = await sut.execute({
      waChat,
      waContact,
      waMessage,
      whatsAppId: whatsAppId.toString(),
    })

    expect(response.isRight()).toBe(true)
    expect(inMemoryMessagesRepository.items).toHaveLength(1)
    expect(fakeMessageEmitter.events).toHaveLength(1)
    expect(fakeChatEmitter.events).toHaveLength(1)
  })

  it('should be able to create a contact and chat from received message', async () => {
    const whatsAppId = makeUniqueEntityID()

    const waContact = makeWAContact()
    const waChat = makeWAChat({}, waContact.id)

    const waMessage = makeWAMessage()

    const response = await sut.execute({
      waChat,
      waContact,
      waMessage,
      whatsAppId: whatsAppId.toString(),
    })

    expect(response.isRight()).toBe(true)

    expect(inMemoryContactsRepository.items).toHaveLength(1)
    expect(inMemoryChatsRepository.items).toHaveLength(1)
    expect(inMemoryMessagesRepository.items).toHaveLength(1)
    expect(fakeChatEmitter.events).toHaveLength(2)
  })

  it('should be able to create a received message with quoted', async () => {
    const whatsAppId = makeUniqueEntityID()

    const waContact = makeWAContact({ isMyContact: true })
    const waChat = makeWAChat({}, waContact.id)

    const waQuotedMessage = makeWAMessage()
    const waMessage = makeWAMessage({ quoted: waQuotedMessage })

    const contact = makeContact({
      waContactId: waContact.id,
      isMyContact: true,
    })
    inMemoryContactsRepository.items.push(contact)

    const chat = makeChat({ waChatId: waChat.id, contact, whatsAppId })
    inMemoryChatsRepository.items.push(chat)

    const quotedMessage = makeMessage({
      waMessageId: waQuotedMessage.id,
      whatsAppId,
      waChatId: waChat.id,
      chatId: chat.id,
    })

    inMemoryMessagesRepository.items.push(quotedMessage)

    const response = await sut.execute({
      waChat,
      waContact,
      waMessage,
      whatsAppId: whatsAppId.toString(),
    })

    expect(response.isRight()).toBe(true)
    if (response.isLeft()) return

    const { message } = response.value
    expect(message.quoted).toBeTruthy()
  })

  it('should be able to create contacts from received message', async () => {
    const whatsAppId = makeUniqueEntityID()

    const waContact = makeWAContact({ isMyContact: true })
    const waChat = makeWAChat({}, waContact.id)

    const waContacts = Array.from(Array(2))
      .map(() => makeWAContact({ isMyContact: true }))
      .concat(makeWAContact({ isMyContact: false }))

    const waMessage = makeWAMessage({
      type: 'multi_vcard',
      contacts: waContacts,
    })

    const messageContacts = waContacts.slice(0, 2).map((waContact) =>
      makeContact({
        waContactId: waContact.id,
        isMyContact: waContact.isMyContact,
      }),
    )
    inMemoryContactsRepository.items.push(...messageContacts)

    const chatContact = makeContact({
      waContactId: waContact.id,
      isMyContact: true,
    })
    inMemoryContactsRepository.items.push(chatContact)

    const chat = makeChat({
      waChatId: waChat.id,
      contact: chatContact,
      whatsAppId,
    })

    inMemoryChatsRepository.items.push(chat)

    const response = await sut.execute({
      waChat,
      waContact,
      waMessage,
      whatsAppId: whatsAppId.toString(),
    })

    expect(response.isRight()).toBe(true)
    if (response.isLeft()) return

    const { message } = response.value

    expect(message.hasContacts()).toBe(true)
    expect(message.contacts).toHaveLength(3)

    expect(inMemoryContactsRepository.items).toHaveLength(4)
  })

  it('should be able to create media from received message', async () => {
    const whatsAppId = makeUniqueEntityID()

    const waContact = makeWAContact({ isMyContact: true })
    const waChat = makeWAChat({}, waContact.id)

    const waMessage = makeWAMessage({
      media: makeWAMessageMedia({ data: '@test' }),
      type: 'document',
    })

    const contact = makeContact({
      waContactId: waContact.id,
      isMyContact: true,
    })
    inMemoryContactsRepository.items.push(contact)

    const chat = makeChat({ waChatId: waChat.id, contact, whatsAppId })
    inMemoryChatsRepository.items.push(chat)

    const response = await sut.execute({
      waChat,
      waContact,
      waMessage,
      whatsAppId: whatsAppId.toString(),
    })

    expect(response.isRight()).toBe(true)
    if (response.isLeft()) return

    const { message } = response.value

    expect(message.hasMedia()).toBe(true)
    expect(message.media).toBeTruthy()

    expect(inMemoryMessageMediasRepository.items).toHaveLength(1)
    expect(fakeUploader.uploads).toHaveLength(1)
  })

  it('should be able to create a received message to soft deleted chat', async () => {
    const whatsAppId = makeUniqueEntityID()

    const waContact = makeWAContact({ isMyContact: true })
    const waChat = makeWAChat({}, waContact.id)

    const waMessage = makeWAMessage()

    const contact = makeContact({
      waContactId: waContact.id,
      isMyContact: true,
    })
    inMemoryContactsRepository.items.push(contact)

    const chat = makeChat({
      waChatId: waChat.id,
      contact,
      whatsAppId,
      deletedAt: new Date(),
    })
    inMemoryChatsRepository.items.push(chat)

    const response = await sut.execute({
      waChat,
      waContact,
      waMessage,
      whatsAppId: whatsAppId.toString(),
    })

    expect(response.isRight()).toBe(true)
    expect(inMemoryChatsRepository.items[0]).toEqual(
      expect.objectContaining({ deletedAt: null }),
    )
  })
})
