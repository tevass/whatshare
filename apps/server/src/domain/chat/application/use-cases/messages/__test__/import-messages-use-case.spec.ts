import { EitherChat } from '@/domain/chat/enterprise/entities/either-chat'
import { EitherMessage } from '@/domain/chat/enterprise/entities/either-message'
import { FakeDateAdapter } from '@/test/adapters/fake-date-adapter'
import { makePrivateChat } from '@/test/factories/make-private-chat'
import { makePrivateMessage } from '@/test/factories/make-private-message'
import { makeUniqueEntityID } from '@/test/factories/make-unique-entity-id'
import { makeWAChat } from '@/test/factories/make-wa-chat'
import { makeWAMessage } from '@/test/factories/make-wa-message'
import { makeWhatsApp } from '@/test/factories/make-whats-app'
import { InMemoryChatsRepository } from '@/test/repositories/in-memory-chats-repository'
import { InMemoryContactsRepository } from '@/test/repositories/in-memory-contacts-repository'
import { InMemoryMessageMediasRepository } from '@/test/repositories/in-memory-message-medias-repository'
import { InMemoryMessagesRepository } from '@/test/repositories/in-memory-messages-repository'
import { FakeWAClientManager } from '@/test/services/fake-wa-client-manager'
import { FakeWAClient } from '@/test/services/fake-wa-client-manager/clients/fake-wa-client'
import { FakeUploader } from '@/test/storage/fake-uploader'
import { CreateContactsFromWaContactsUseCase } from '../../contacts/create-contacts-from-wa-contacts-use-case'
import { CreateMessageFromWAMessageUseCase } from '../create-message-from-wa-message-use-case'
import { ImportMessagesUseCase } from '../import-messages-use-case'

let inMemoryChatsRepository: InMemoryChatsRepository
let inMemoryContactsRepository: InMemoryContactsRepository
let inMemoryMessagesRepository: InMemoryMessagesRepository
let inMemoryMessageMediasRepository: InMemoryMessageMediasRepository
let fakeWAClientManager: FakeWAClientManager
let fakeUploader: FakeUploader
let fakeDateAdapter: FakeDateAdapter

let createContactsFromWaContacts: CreateContactsFromWaContactsUseCase
let createMessageFromWAMessage: CreateMessageFromWAMessageUseCase

let sut: ImportMessagesUseCase

describe('ImportMessagesUseCase', () => {
  beforeEach(() => {
    inMemoryChatsRepository = new InMemoryChatsRepository()
    inMemoryContactsRepository = new InMemoryContactsRepository()
    inMemoryMessagesRepository = new InMemoryMessagesRepository()
    inMemoryMessageMediasRepository = new InMemoryMessageMediasRepository(
      inMemoryMessagesRepository,
    )
    fakeWAClientManager = new FakeWAClientManager()
    fakeUploader = new FakeUploader()
    fakeDateAdapter = new FakeDateAdapter()

    createContactsFromWaContacts = new CreateContactsFromWaContactsUseCase(
      inMemoryContactsRepository,
    )

    createMessageFromWAMessage = new CreateMessageFromWAMessageUseCase(
      inMemoryMessagesRepository,
      inMemoryChatsRepository,
      inMemoryMessageMediasRepository,
      createContactsFromWaContacts,
      fakeUploader,
      fakeDateAdapter,
    )

    sut = new ImportMessagesUseCase(
      inMemoryChatsRepository,
      inMemoryMessagesRepository,
      fakeWAClientManager,
      createMessageFromWAMessage,
    )
  })

  it('should be able to import messages from wa-client', async () => {
    const whatsAppId = makeUniqueEntityID()
    const whatsApp = makeWhatsApp({ status: 'connected' }, whatsAppId)

    const waChat = makeWAChat({ waClientId: whatsAppId })
    const chat = makePrivateChat({ whatsAppId, waChatId: waChat.id })
    inMemoryChatsRepository.items.push(EitherChat.create(chat))

    const fakeWAClient = FakeWAClient.createFromWhatsApp(whatsApp)
    fakeWAClientManager.clients.set(whatsAppId.toString(), fakeWAClient)

    const waMessages = Array.from(Array(4)).map(() =>
      makeWAMessage({ chatId: waChat.id }),
    )
    fakeWAClient.message.messages.push(...waMessages)

    inMemoryMessagesRepository.items.push(
      ...waMessages.slice(2).map((waMessage) =>
        EitherMessage.create(
          makePrivateMessage({
            whatsAppId,
            chatId: chat.id,
            waChatId: waChat.id,
            waMessageId: waMessage.id,
          }),
        ),
      ),
    )

    const response = await sut.execute({
      whatsAppId: whatsAppId.toString(),
      waChatId: waChat.id.toString(),
    })

    expect(response.isRight()).toBe(true)
    if (response.isLeft()) return

    const { messages } = response.value

    expect(messages).toHaveLength(2)
    expect(inMemoryMessagesRepository.items).toHaveLength(4)
  })
})
