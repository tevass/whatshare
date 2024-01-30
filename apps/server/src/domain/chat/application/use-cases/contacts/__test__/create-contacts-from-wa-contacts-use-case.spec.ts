import { InMemoryContactsRepository } from '@/test/repositories/in-memory-contacts-repository'
import { makeWAContact } from '@/test/factories/make-wa-contact'
import { CreateContactsFromWaContactsUseCase } from '../create-contacts-from-wa-contacts-use-case'

let inMemoryContactsRepository: InMemoryContactsRepository

let sut: CreateContactsFromWaContactsUseCase

describe('CreateContactsFromWaContactsUseCase', () => {
  beforeEach(() => {
    inMemoryContactsRepository = new InMemoryContactsRepository()

    sut = new CreateContactsFromWaContactsUseCase(inMemoryContactsRepository)
  })

  it('should be able to create contacts from wa contacts', async () => {
    const waContacts = Array.from(Array(3))
      .map(() => makeWAContact({ isMyContact: true }))
      .concat(makeWAContact({ isMyContact: false }))

    inMemoryContactsRepository.items.push(
      ...waContacts.slice(0, 2).map((waContact) => waContact.toContact()),
    )

    const response = await sut.execute({
      waContacts,
    })

    expect(response.isRight()).toBe(true)
    if (response.isLeft()) return

    const { contacts } = response.value
    expect(contacts).toHaveLength(4)
    expect(inMemoryContactsRepository.items).toHaveLength(4)
  })
})
