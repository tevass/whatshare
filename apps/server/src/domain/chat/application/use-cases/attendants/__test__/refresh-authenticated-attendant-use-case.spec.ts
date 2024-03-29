import { FakeEncrypter } from '@/test/cryptography/faker-encrypter'
import { makeAttendant } from '@/test/factories/make-attendant'
import { makeUniqueEntityID } from '@/test/factories/make-unique-entity-id'
import { InMemoryAttendantsRepository } from '@/test/repositories/in-memory-attendants-repository'
import { RefreshAuthenticatedAttendantUseCase } from '../refresh-authenticated-attendant-use-case'

let inMemoryAttendantsRepository: InMemoryAttendantsRepository
let fakerEncrypter: FakeEncrypter

let sut: RefreshAuthenticatedAttendantUseCase

describe('RefreshAuthenticatedAttendantUseCase', () => {
  beforeEach(() => {
    inMemoryAttendantsRepository = new InMemoryAttendantsRepository()
    fakerEncrypter = new FakeEncrypter()

    sut = new RefreshAuthenticatedAttendantUseCase(
      inMemoryAttendantsRepository,
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
