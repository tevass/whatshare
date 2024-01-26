import { FakeMessageEmitter } from '@/test/emitters/fake-message-emitter'
import { makeMessage } from '@/test/factories/make-message'
import { makeWAMessage } from '@/test/factories/make-wa-message'
import { InMemoryMessagesRepository } from '@/test/repositories/in-memory-messages-repository'
import { HandleWAChangeMessageAck } from '../handle-wa-change-message-ack'
import { FakeDateAdapter } from '@/test/adapters/fake-date-adapter'

let inMemoryMessagesRepository: InMemoryMessagesRepository
let fakeMessageEmitter: FakeMessageEmitter
let fakeDateAdapter: FakeDateAdapter

let sut: HandleWAChangeMessageAck

describe('HandleWAChangeMessageAck', () => {
  beforeEach(() => {
    inMemoryMessagesRepository = new InMemoryMessagesRepository()
    fakeMessageEmitter = new FakeMessageEmitter()
    fakeDateAdapter = new FakeDateAdapter()

    sut = new HandleWAChangeMessageAck(
      inMemoryMessagesRepository,
      fakeMessageEmitter,
      fakeDateAdapter,
    )
  })

  it('should be able to change ack of message', async () => {
    const waMessage = makeWAMessage()

    inMemoryMessagesRepository.items.push(
      makeMessage({ waMessageId: waMessage.id }),
    )

    const response = await sut.execute({
      waMessage,
      ack: 'sent',
    })

    expect(response.isRight()).toBe(true)
    if (response.isLeft()) return

    const { message } = response.value
    expect(message.ack).toBe('sent')
    expect(fakeMessageEmitter.payloads).toHaveLength(1)
    expect(message.createdAt.toString()).toBe(
      fakeDateAdapter.fromUnix(waMessage.timestamp).toDate().toString(),
    )
  })
})
