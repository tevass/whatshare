import { makeUniqueEntityID } from '@/test/factories/make-unique-entity-id'
import { InMemoryMessagesRepository } from '@/test/repositories/in-memory-messages-repository'
import { FetchMessagesUseCase } from '../fetch-messages-use-case'
import { makePrivateMessage } from '@/test/factories/make-private-message'

let inMemoryMessagesRepository: InMemoryMessagesRepository

let sut: FetchMessagesUseCase

describe('FetchMessagesUseCase', () => {
  beforeEach(() => {
    inMemoryMessagesRepository = new InMemoryMessagesRepository()

    sut = new FetchMessagesUseCase(inMemoryMessagesRepository)
  })

  it('should be able to fetch messages', async () => {
    const chatId = makeUniqueEntityID()

    inMemoryMessagesRepository.items.push(
      ...Array.from(Array(3)).map(() => makePrivateMessage({ chatId })),
    )

    const response = await sut.execute({
      chatId: chatId.toString(),
      page: 1,
    })

    expect(response.isRight()).toBe(true)
    if (response.isLeft()) return

    const { messages } = response.value
    expect(messages).toHaveLength(3)
  })
})
