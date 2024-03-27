import { makeGroup } from '@/test/factories/make-group'
import { makeWAContact } from '@/test/factories/make-wa-contact'
import { makeWAEntityID } from '@/test/factories/make-wa-entity-id'
import { InMemoryGroupsRepository } from '@/test/repositories/in-memory-groups-repository'
import { faker } from '@faker-js/faker'
import { CreateGroupsFromWaContactsUseCase } from '../create-groups-from-wa-contacts-use-case'

let inMemoryGroupsRepository: InMemoryGroupsRepository

let sut: CreateGroupsFromWaContactsUseCase

describe('CreateGroupsFromWaContactsUseCase', () => {
  beforeEach(() => {
    inMemoryGroupsRepository = new InMemoryGroupsRepository()

    sut = new CreateGroupsFromWaContactsUseCase(inMemoryGroupsRepository)
  })

  it('should be able to create groups from wa contacts', async () => {
    const waGroupId = makeWAEntityID()

    const waContacts = Array.from(Array(2))
      .map(() =>
        makeWAContact({ isMyContact: true, imageUrl: null, isGroup: true }),
      )
      .concat(
        makeWAContact({ isMyContact: false, imageUrl: null, isGroup: true }),
      )

    inMemoryGroupsRepository.items.push(
      ...waContacts
        .slice(0, 2)
        .map((waContact) => waContact.toGroup())
        .concat(makeGroup({ waGroupId, imageUrl: null })),
    )

    waContacts.push(
      makeWAContact(
        { imageUrl: faker.image.url(), isMyContact: true, isGroup: true },
        waGroupId,
      ),
    )

    const response = await sut.execute({
      waContacts,
    })

    expect(response.isRight()).toBe(true)
    if (response.isLeft()) return

    const { groups } = response.value

    expect(groups).toHaveLength(4)
    expect(inMemoryGroupsRepository.items).toHaveLength(4)
    expect(inMemoryGroupsRepository.items[2].imageUrl).toEqual(
      expect.any(String),
    )
  })
})
