import { makeChat } from '@/test/factories/make-chat'
import { makeMessage } from '@/test/factories/make-message'
import { makeUniqueEntityID } from '@/test/factories/make-unique-entity-id'
import { makeWAChat } from '@/test/factories/make-wa-chat'
import { makeWAMessage } from '@/test/factories/make-wa-message'
import { InMemoryChatsRepository } from '@/test/repositories/in-memory-chats-repository'
import { InMemoryContactsRepository } from '@/test/repositories/in-memory-contacts-repository'
import { InMemoryMessageMediasRepository } from '@/test/repositories/in-memory-message-medias-repository'
import { InMemoryMessagesRepository } from '@/test/repositories/in-memory-messages-repository'
import { FakeUploader } from '@/test/storage/fake-uploader'
import { CreateMessageFromWAMessageUseCase } from '../create-message-from-wa-message-use-case'
import { ImportMessagesUseCase } from '../import-messages-use-case'
import { makeWhatsApp } from '@/test/factories/make-whats-app'
import { FakeWAServiceManager } from '@/test/services/fake-wa-service-manager'
import { FakeWAService } from '@/test/services/fake-wa-service'

let inMemoryChatsRepository: InMemoryChatsRepository
let inMemoryContactsRepository: InMemoryContactsRepository
let inMemoryMessagesRepository: InMemoryMessagesRepository
let inMemoryMessageMediasRepository: InMemoryMessageMediasRepository
let fakeWAServiceManager: FakeWAServiceManager
let fakeUploader: FakeUploader

let createMessageFromWAMessage: CreateMessageFromWAMessageUseCase

let sut: ImportMessagesUseCase

describe('ImportMessagesUseCase', () => {
  beforeEach(() => {
    inMemoryChatsRepository = new InMemoryChatsRepository()
    inMemoryContactsRepository = new InMemoryContactsRepository()
    inMemoryMessagesRepository = new InMemoryMessagesRepository()
    inMemoryMessageMediasRepository = new InMemoryMessageMediasRepository()
    fakeWAServiceManager = new FakeWAServiceManager()
    fakeUploader = new FakeUploader()

    createMessageFromWAMessage = new CreateMessageFromWAMessageUseCase(
      inMemoryMessagesRepository,
      inMemoryContactsRepository,
      inMemoryChatsRepository,
      inMemoryMessageMediasRepository,
      fakeUploader,
    )

    sut = new ImportMessagesUseCase(
      inMemoryChatsRepository,
      inMemoryMessagesRepository,
      fakeWAServiceManager,
      createMessageFromWAMessage,
    )
  })

  it('should be able to import messages from wa-client', async () => {
    const whatsAppId = makeUniqueEntityID()
    const whatsApp = makeWhatsApp({ status: 'connected' }, whatsAppId)

    const waChat = makeWAChat({ waClientId: whatsAppId })
    const chat = makeChat({ whatsAppId, waChatId: waChat.id })
    inMemoryChatsRepository.items.push(chat)

    const fakeWAService = FakeWAService.createFromWhatsApp(whatsApp)
    fakeWAServiceManager.services.set(whatsAppId.toString(), fakeWAService)

    const waMessages = Array.from(Array(4)).map(() =>
      makeWAMessage({ chatId: waChat.id }),
    )
    fakeWAService.message.messages.push(...waMessages)

    inMemoryMessagesRepository.items.push(
      ...waMessages.slice(2).map((waMessage) =>
        makeMessage({
          whatsAppId,
          chatId: chat.id,
          waChatId: waChat.id,
          waMessageId: waMessage.id,
        }),
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
