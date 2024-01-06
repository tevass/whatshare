import { makeChat } from '@/test/factories/make-chat'
import { makeUniqueEntityID } from '@/test/factories/make-unique-entity-id'
import { InMemoryChatsRepository } from '@/test/repositories/in-memory-chats-repository'
import { FetchChatsUseCase } from '../fetch-chats-use-case'

let inMemoryChatsRepository: InMemoryChatsRepository

let sut: FetchChatsUseCase

describe('FetchChatsUseCase', () => {
  beforeEach(() => {
    inMemoryChatsRepository = new InMemoryChatsRepository()

    sut = new FetchChatsUseCase(inMemoryChatsRepository)
  })

  it('should be able to fetch chats', async () => {
    const whatsAppId = makeUniqueEntityID()

    inMemoryChatsRepository.items.push(
      ...Array.from(Array(3)).map(() => makeChat({ whatsAppId })),
    )

    const response = await sut.execute({
      whatsAppId: whatsAppId.toString(),
      page: 1,
    })

    expect(response.isRight()).toBe(true)
    if (response.isLeft()) return

    const { chats } = response.value
    expect(chats).toHaveLength(3)
  })
})
