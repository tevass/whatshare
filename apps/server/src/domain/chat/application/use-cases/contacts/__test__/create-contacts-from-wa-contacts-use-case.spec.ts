import { InMemoryContactsRepository } from '@/test/repositories/in-memory-contacts-repository'
import { makeWAContact } from '@/test/factories/make-wa-contact'
import { CreateContactsFromWaContactsUseCase } from '../create-contacts-from-wa-contacts-use-case'
import { makeContact } from '@/test/factories/make-contact'
import { faker } from '@faker-js/faker'
import { makeWAEntityID } from '@/test/factories/make-wa-entity-id'

let inMemoryContactsRepository: InMemoryContactsRepository

let sut: CreateContactsFromWaContactsUseCase

describe('CreateContactsFromWaContactsUseCase', () => {
  beforeEach(() => {
    inMemoryContactsRepository = new InMemoryContactsRepository()

    sut = new CreateContactsFromWaContactsUseCase(inMemoryContactsRepository)
  })

  it('should be able to create contacts from wa contacts', async () => {
    const waContactId = makeWAEntityID()

    const waContacts = Array.from(Array(2))
      .map(() => makeWAContact({ isMyContact: true, imageUrl: null }))
      .concat(makeWAContact({ isMyContact: false, imageUrl: null }))

    inMemoryContactsRepository.items.push(
      ...waContacts
        .slice(0, 2)
        .map((waContact) => waContact.toContact())
        .concat(makeContact({ waContactId, imageUrl: null })),
    )

    waContacts.push(
      makeWAContact(
        { imageUrl: faker.image.url(), isMyContact: true },
        waContactId,
      ),
    )

    const response = await sut.execute({
      waContacts,
    })

    expect(response.isRight()).toBe(true)
    if (response.isLeft()) return

    const { contacts } = response.value

    expect(contacts).toHaveLength(4)
    expect(inMemoryContactsRepository.items).toHaveLength(4)
    expect(inMemoryContactsRepository.items[2].imageUrl).toEqual(
      expect.any(String),
    )
  })
})
