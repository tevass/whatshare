import { FakeDateAdapter } from '@/test/adapters/fake-date-adapter'
import { FakeMessageEmitter } from '@/test/emitters/fake-message-emitter'
import { makeMessage } from '@/test/factories/make-message'
import { makeMessageMedia } from '@/test/factories/make-message-media'
import { makeUniqueEntityID } from '@/test/factories/make-unique-entity-id'
import { makeWAEntityID } from '@/test/factories/make-wa-entity-id'
import { makeWAMessage } from '@/test/factories/make-wa-message'
import { InMemoryMessageMediasRepository } from '@/test/repositories/in-memory-message-medias-repository'
import { InMemoryMessagesRepository } from '@/test/repositories/in-memory-messages-repository'
import { FakeUploader } from '@/test/storage/fake-uploader'
import { HandleWARevokeMessage } from '../handle-wa-revoke-message'

let inMemoryMessagesRepository: InMemoryMessagesRepository
let inMemoryMessageMediasRepository: InMemoryMessageMediasRepository
let fakeDateAdapter: FakeDateAdapter
let fakeMessageEmitter: FakeMessageEmitter
let fakeUploader: FakeUploader

let sut: HandleWARevokeMessage

describe('HandleWARevokeMessage', () => {
  beforeEach(() => {
    inMemoryMessagesRepository = new InMemoryMessagesRepository()
    inMemoryMessageMediasRepository = new InMemoryMessageMediasRepository()
    fakeDateAdapter = new FakeDateAdapter()
    fakeMessageEmitter = new FakeMessageEmitter()
    fakeUploader = new FakeUploader()

    sut = new HandleWARevokeMessage(
      inMemoryMessagesRepository,
      inMemoryMessageMediasRepository,
      fakeDateAdapter,
      fakeMessageEmitter,
      fakeUploader,
    )
  })

  it('should be able to revoke a message', async () => {
    const whatsAppId = makeUniqueEntityID()
    const waChatId = makeWAEntityID()

    const waMessage = makeWAMessage()

    inMemoryMessagesRepository.items.push(
      makeMessage({
        waChatId,
        whatsAppId,
        waMessageId: waMessage.id,
        createdAt: fakeDateAdapter.fromUnix(waMessage.timestamp).toDate(),
      }),
    )

    const response = await sut.execute({
      waChatId,
      whatsAppId: whatsAppId.toString(),
      waRevokedMessage: waMessage,
    })

    expect(response.isRight()).toBe(true)
    if (response.isLeft()) return

    const { message } = response.value
    expect(message.type).toBe('revoked')
    expect(fakeMessageEmitter.events).toHaveLength(1)
  })

  it('should be able to delete message media from revoke message', async () => {
    const whatsAppId = makeUniqueEntityID()
    const waChatId = makeWAEntityID()

    const waMessage = makeWAMessage()

    const messageMedia = makeMessageMedia()
    inMemoryMessageMediasRepository.items.push(messageMedia)

    const messageToRevoke = makeMessage({
      waChatId,
      whatsAppId,
      waMessageId: waMessage.id,
      createdAt: fakeDateAdapter.fromUnix(waMessage.timestamp).toDate(),
      type: 'image',
      media: messageMedia,
    })

    inMemoryMessagesRepository.items.push(messageToRevoke)

    const response = await sut.execute({
      waChatId,
      whatsAppId: whatsAppId.toString(),
      waRevokedMessage: waMessage,
    })

    expect(response.isRight()).toBe(true)
    expect(inMemoryMessageMediasRepository.items).toHaveLength(0)
    expect(fakeUploader.uploads).toHaveLength(0)
  })
})
