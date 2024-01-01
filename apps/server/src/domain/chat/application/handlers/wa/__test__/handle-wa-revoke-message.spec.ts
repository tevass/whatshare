import { FakeMessageEmitter } from '@/test/emitters/fake-message-emitter'
import { makeMessage } from '@/test/factories/make-message'
import { makeUniqueEntityID } from '@/test/factories/make-unique-entity-id'
import { makeWAEntityID } from '@/test/factories/make-wa-entity-id'
import { makeWAMessage } from '@/test/factories/make-wa-message'
import { FakeDateProvider } from '@/test/providers/fake-date-provider'
import { InMemoryMessagesRepository } from '@/test/repositories/in-memory-messages-repository'
import { HandleWARevokeMessage } from '../handle-wa-revoke-message'

let inMemoryMessagesRepository: InMemoryMessagesRepository
let fakeDateProvider: FakeDateProvider
let fakeMessageEmitter: FakeMessageEmitter

let sut: HandleWARevokeMessage

vi.mock('@/test/emitters/fake-message-emitter', () => {
  const FakeMessageEmitter = vi.fn()

  FakeMessageEmitter.prototype.emit = vi.fn()

  return { FakeMessageEmitter }
})

describe('HandleWARevokeMessage', () => {
  beforeEach(() => {
    inMemoryMessagesRepository = new InMemoryMessagesRepository()
    fakeDateProvider = new FakeDateProvider()
    fakeMessageEmitter = new FakeMessageEmitter()

    sut = new HandleWARevokeMessage(
      inMemoryMessagesRepository,
      fakeDateProvider,
      fakeMessageEmitter,
    )
  })

  afterEach(() => {
    vi.clearAllMocks()
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
        createdAt: fakeDateProvider.fromUnix(waMessage.timestamp).toDate(),
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
    expect(fakeMessageEmitter.emit).toHaveBeenCalled()
  })
})
