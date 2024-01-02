import { FakeDateAdapter } from '@/test/adapters/fake-date-adapter'
import { FakeEncrypter } from '@/test/cryptography/faker-encrypter'
import { makeAttendant } from '@/test/factories/make-attendant'
import { makeUniqueEntityID } from '@/test/factories/make-unique-entity-id'
import { InMemoryAttendantsRepository } from '@/test/repositories/in-memory-attendants-repository'
import { RefreshAuthenticateAttendantUseCase } from '../refresh-authenticate-attendant-use-case'

let inMemoryAttendantsRepository: InMemoryAttendantsRepository
let fakeDateAdapter: FakeDateAdapter
let fakerEncrypter: FakeEncrypter

let sut: RefreshAuthenticateAttendantUseCase

describe('RefreshAuthenticateAttendantUseCase', () => {
  beforeEach(() => {
    inMemoryAttendantsRepository = new InMemoryAttendantsRepository()
    fakeDateAdapter = new FakeDateAdapter()
    fakerEncrypter = new FakeEncrypter()

    sut = new RefreshAuthenticateAttendantUseCase(
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

    const { attendant } = response.value
    expect(attendant.id).toEqual(attendantId)
  })
})
