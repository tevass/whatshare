import { makeContact } from '@/test/factories/make-contact'
import { InMemoryContactsRepository } from '@/test/repositories/in-memory-contacts-repository'
import { FetchContactsUseCase } from '../fetch-contacts-use-case'

let inMemoryContactsRepository: InMemoryContactsRepository

let sut: FetchContactsUseCase

describe('FetchContactsUseCase', () => {
  beforeEach(() => {
    inMemoryContactsRepository = new InMemoryContactsRepository()

    sut = new FetchContactsUseCase(inMemoryContactsRepository)
  })

  it('should be able to fetch contacts', async () => {
    inMemoryContactsRepository.items.push(
      ...Array.from(Array(3)).map(() => makeContact()),
    )

    const response = await sut.execute({
      page: 1,
    })

    expect(response.isRight()).toBe(true)
    if (response.isLeft()) return

    const { contacts } = response.value
    expect(contacts).toHaveLength(3)
  })
})
