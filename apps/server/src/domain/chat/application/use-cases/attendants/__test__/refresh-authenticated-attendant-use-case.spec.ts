import { FakeDateAdapter } from '@/test/adapters/fake-date-adapter'
import { FakeEncrypter } from '@/test/cryptography/faker-encrypter'
import { makeAttendant } from '@/test/factories/make-attendant'
import { makeUniqueEntityID } from '@/test/factories/make-unique-entity-id'
import { InMemoryAttendantProfilesRepository } from '@/test/repositories/in-memory-attendant-profiles-repository'
import { InMemoryAttendantsRepository } from '@/test/repositories/in-memory-attendants-repository'
import { RefreshAuthenticatedAttendantUseCase } from '../refresh-authenticated-attendant-use-case'

let inMemoryAttendantProfilesRepository: InMemoryAttendantProfilesRepository
let inMemoryAttendantsRepository: InMemoryAttendantsRepository
let fakeDateAdapter: FakeDateAdapter
let fakerEncrypter: FakeEncrypter

let sut: RefreshAuthenticatedAttendantUseCase

describe('RefreshAuthenticatedAttendantUseCase', () => {
  beforeEach(() => {
    inMemoryAttendantProfilesRepository =
      new InMemoryAttendantProfilesRepository()
    inMemoryAttendantsRepository = new InMemoryAttendantsRepository(
      inMemoryAttendantProfilesRepository,
    )
    fakeDateAdapter = new FakeDateAdapter()
    fakerEncrypter = new FakeEncrypter()

    sut = new RefreshAuthenticatedAttendantUseCase(
      inMemoryAttendantsRepository,
      fakeDateAdapter,
      fakerEncrypter,
    )
  })

  it('should be able to refresh authenticate of an attendant', async () => {
    const attendantId = makeUniqueEntityID()

    inMemoryAttendantsRepository.items.push(makeAttendant({}, attendantId))

    const response = await sut.execute({
      attendantId: attendantId.toString(),
    })

    expect(response.isRight()).toBe(true)
    if (response.isLeft()) return

    const { attendant, accessToken, refreshToken } = response.value
    expect(attendant.id).toEqual(attendantId)

    expect(accessToken).toEqual(expect.any(String))
    expect(refreshToken).toEqual(expect.any(String))
  })
})
