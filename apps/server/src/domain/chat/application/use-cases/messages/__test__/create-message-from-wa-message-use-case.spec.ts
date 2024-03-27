import { GroupQuotedMessage } from '@/domain/chat/enterprise/entities/group-quoted-message'
import { PrivateQuotedMessage } from '@/domain/chat/enterprise/entities/private-quoted-message'
import {
  isGroupMessage,
  isPrivateMessage,
} from '@/domain/chat/enterprise/types/message'
import { FakeDateAdapter } from '@/test/adapters/fake-date-adapter'
import { makeGroupChat } from '@/test/factories/make-group-chat'
import { makeGroupMessage } from '@/test/factories/make-group-message'
import { makePrivateChat } from '@/test/factories/make-private-chat'
import { makePrivateMessage } from '@/test/factories/make-private-message'
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
import { CreateContactsFromWaContactsUseCase } from '../../contacts/create-contacts-from-wa-contacts-use-case'
import { CreateMessageFromWAMessageUseCase } from '../create-message-from-wa-message-use-case'

let inMemoryMessagesRepository: InMemoryMessagesRepository
let inMemoryContactsRepository: InMemoryContactsRepository
let inMemoryChatsRepository: InMemoryChatsRepository
let inMemoryMessageMediasRepository: InMemoryMessageMediasRepository
let fakeUploader: FakeUploader
let fakeDateAdapter: FakeDateAdapter

let createContactsFromWaContacts: CreateContactsFromWaContactsUseCase
let sut: CreateMessageFromWAMessageUseCase

describe('CreateMessageFromWAMessageUseCase', () => {
  beforeEach(() => {
    inMemoryMessagesRepository = new InMemoryMessagesRepository()
    inMemoryContactsRepository = new InMemoryContactsRepository()
    inMemoryChatsRepository = new InMemoryChatsRepository()
    inMemoryMessageMediasRepository = new InMemoryMessageMediasRepository(
      inMemoryMessagesRepository,
    )
    fakeUploader = new FakeUploader()
    fakeDateAdapter = new FakeDateAdapter()

    createContactsFromWaContacts = new CreateContactsFromWaContactsUseCase(
      inMemoryContactsRepository,
    )

    sut = new CreateMessageFromWAMessageUseCase(
      inMemoryMessagesRepository,
      inMemoryChatsRepository,
      inMemoryContactsRepository,
      inMemoryMessageMediasRepository,
      createContactsFromWaContacts,
      fakeUploader,
      fakeDateAdapter,
    )
  })

  it('should be able to create contacts from wa-message', async () => {
    const whatsAppId = makeUniqueEntityID()

    const waContact = makeWAContact({ isMyContact: true, isGroup: false })
    const waChat = makeWAChat({ contact: waContact }, waContact.id)

    const waContacts = Array.from(Array(2))
      .map(() => makeWAContact({ isMyContact: true, isGroup: false }))
      .concat(makeWAContact({ isMyContact: false, isGroup: false }))

    const waMessage = makeWAMessage({
      type: 'multi_vcard',
      contacts: waContacts,
    })

    const messageContacts = waContacts
      .slice(0, 2)
      .map((waContact) => waContact.toContact())
    inMemoryContactsRepository.items.push(...messageContacts)

    const chatContact = waContact.toContact()
    inMemoryContactsRepository.items.push(chatContact)

    const chat = makePrivateChat({
      waChatId: waChat.id,
      contact: chatContact,
      whatsAppId,
    })

    inMemoryChatsRepository.items.push(chat)

    const response = await sut.execute({
      waChatId: waChat.id.toString(),
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

  it('should be able to create media from wa-message', async () => {
    const whatsAppId = makeUniqueEntityID()

    const waContact = makeWAContact({ isMyContact: true })
    const waChat = makeWAChat({}, waContact.id)

    const waMessage = makeWAMessage({
      media: makeWAMessageMedia({ data: '@test' }),
      type: 'document',
    })

    const contact = waContact.toContact()
    inMemoryContactsRepository.items.push(contact)

    const chat = makePrivateChat({ waChatId: waChat.id, contact, whatsAppId })
    inMemoryChatsRepository.items.push(chat)

    const response = await sut.execute({
      waChatId: waChat.id.toString(),
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

  it('should be able to create a private message to soft deleted chat', async () => {
    const whatsAppId = makeUniqueEntityID()

    const waContact = makeWAContact({ isMyContact: true })
    const waChat = makeWAChat({}, waContact.id)

    const waMessage = makeWAMessage()

    const contact = waContact.toContact()
    inMemoryContactsRepository.items.push(contact)

    const chat = makePrivateChat({
      waChatId: waChat.id,
      contact,
      whatsAppId,
      deletedAt: new Date(),
    })
    inMemoryChatsRepository.items.push(chat)

    const response = await sut.execute({
      waChatId: waChat.id.toString(),
      waMessage,
      whatsAppId: whatsAppId.toString(),
    })

    expect(response.isRight()).toBe(true)
    expect(inMemoryMessagesRepository.items).toHaveLength(1)
  })
})

describe('CreateMessageFromWAMessageUseCase (Private Message)', () => {
  beforeEach(() => {
    inMemoryMessagesRepository = new InMemoryMessagesRepository()
    inMemoryContactsRepository = new InMemoryContactsRepository()
    inMemoryChatsRepository = new InMemoryChatsRepository()
    inMemoryMessageMediasRepository = new InMemoryMessageMediasRepository(
      inMemoryMessagesRepository,
    )
    fakeUploader = new FakeUploader()
    fakeDateAdapter = new FakeDateAdapter()

    createContactsFromWaContacts = new CreateContactsFromWaContactsUseCase(
      inMemoryContactsRepository,
    )

    sut = new CreateMessageFromWAMessageUseCase(
      inMemoryMessagesRepository,
      inMemoryChatsRepository,
      inMemoryContactsRepository,
      inMemoryMessageMediasRepository,
      createContactsFromWaContacts,
      fakeUploader,
      fakeDateAdapter,
    )
  })

  it('should be able to create a private message from wa-message', async () => {
    const whatsAppId = makeUniqueEntityID()

    const waContact = makeWAContact({ isMyContact: true })
    const waChat = makeWAChat({}, waContact.id)

    const waMessage = makeWAMessage()

    const contact = waContact.toContact()
    inMemoryContactsRepository.items.push(contact)

    const chat = makePrivateChat({ waChatId: waChat.id, contact, whatsAppId })
    inMemoryChatsRepository.items.push(chat)

    const response = await sut.execute({
      waChatId: waChat.id.toString(),
      waMessage,
      whatsAppId: whatsAppId.toString(),
    })

    expect(response.isRight()).toBe(true)
    if (response.isLeft()) return

    const { message } = response.value

    expect(isPrivateMessage(message)).toBe(true)
    expect(inMemoryMessagesRepository.items).toHaveLength(1)
  })

  it('should be able to create a private message with quoted from wa-message quoted', async () => {
    const whatsAppId = makeUniqueEntityID()

    const waContact = makeWAContact({ isMyContact: true })
    const waChat = makeWAChat({}, waContact.id)

    const waQuotedMessage = makeWAMessage()
    const waMessage = makeWAMessage({ quoted: waQuotedMessage })

    const contact = waContact.toContact()
    inMemoryContactsRepository.items.push(contact)

    const chat = makePrivateChat({ waChatId: waChat.id, contact, whatsAppId })
    inMemoryChatsRepository.items.push(chat)

    const quotedMessage = makePrivateMessage({
      waMessageId: waQuotedMessage.id,
      whatsAppId,
      waChatId: waChat.id,
      chatId: chat.id,
    })

    inMemoryMessagesRepository.items.push(quotedMessage)

    const response = await sut.execute({
      waChatId: waChat.id.toString(),
      waMessage,
      whatsAppId: whatsAppId.toString(),
    })

    expect(response.isRight()).toBe(true)
    if (response.isLeft()) return

    const { message } = response.value
    expect(message.quoted).toBeInstanceOf(PrivateQuotedMessage)
    expect(message.createdAt.toString()).toBe(
      fakeDateAdapter.fromUnix(waMessage.timestamp).toDate().toString(),
    )
  })
})

describe('CreateMessageFromWAMessageUseCase (Group Message)', () => {
  beforeEach(() => {
    inMemoryMessagesRepository = new InMemoryMessagesRepository()
    inMemoryContactsRepository = new InMemoryContactsRepository()
    inMemoryChatsRepository = new InMemoryChatsRepository()
    inMemoryMessageMediasRepository = new InMemoryMessageMediasRepository(
      inMemoryMessagesRepository,
    )
    fakeUploader = new FakeUploader()
    fakeDateAdapter = new FakeDateAdapter()

    createContactsFromWaContacts = new CreateContactsFromWaContactsUseCase(
      inMemoryContactsRepository,
    )

    sut = new CreateMessageFromWAMessageUseCase(
      inMemoryMessagesRepository,
      inMemoryChatsRepository,
      inMemoryContactsRepository,
      inMemoryMessageMediasRepository,
      createContactsFromWaContacts,
      fakeUploader,
      fakeDateAdapter,
    )
  })

  it('should be able to create a group message from wa-message', async () => {
    const whatsAppId = makeUniqueEntityID()

    const waContact = makeWAContact({ isMyContact: true })
    const waChat = makeWAChat({}, waContact.id)

    const waMessage = makeWAMessage()

    const contact = waContact.toContact()
    inMemoryContactsRepository.items.push(contact)

    const chat = makeGroupChat({ waChatId: waChat.id, whatsAppId })
    inMemoryChatsRepository.items.push(chat)

    const response = await sut.execute({
      waChatId: waChat.id.toString(),
      waMessage,
      whatsAppId: whatsAppId.toString(),
    })

    expect(response.isRight()).toBe(true)
    if (response.isLeft()) return

    const { message } = response.value

    expect(isGroupMessage(message)).toBe(true)
    expect(inMemoryMessagesRepository.items).toHaveLength(1)
  })

  it('should be able to create a group message with quoted from wa-message quoted', async () => {
    const whatsAppId = makeUniqueEntityID()

    const waContact = makeWAContact({ isMyContact: true })
    const waChat = makeWAChat({}, waContact.id)

    const waQuotedMessage = makeWAMessage()
    const waMessage = makeWAMessage({ quoted: waQuotedMessage })

    const contact = waContact.toContact()
    inMemoryContactsRepository.items.push(contact)

    const chat = makeGroupChat({ waChatId: waChat.id, whatsAppId })
    inMemoryChatsRepository.items.push(chat)

    const quotedMessage = makeGroupMessage({
      waMessageId: waQuotedMessage.id,
      whatsAppId,
      waChatId: waChat.id,
      chatId: chat.id,
    })

    inMemoryMessagesRepository.items.push(quotedMessage)

    const response = await sut.execute({
      waChatId: waChat.id.toString(),
      waMessage,
      whatsAppId: whatsAppId.toString(),
    })

    expect(response.isRight()).toBe(true)
    if (response.isLeft()) return

    const { message } = response.value

    expect(message.quoted).toBeInstanceOf(GroupQuotedMessage)
    expect(message.createdAt.toString()).toBe(
      fakeDateAdapter.fromUnix(waMessage.timestamp).toDate().toString(),
    )
  })
})
