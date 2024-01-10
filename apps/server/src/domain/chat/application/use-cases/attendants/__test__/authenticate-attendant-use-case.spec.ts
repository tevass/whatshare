import { FakeDateAdapter } from '@/test/adapters/fake-date-adapter'
import { FakeEncrypter } from '@/test/cryptography/faker-encrypter'
import { FakeHashService } from '@/test/cryptography/faker-hash-service'
import { makeAttendant } from '@/test/factories/make-attendant'
import { InMemoryAttendantProfilesRepository } from '@/test/repositories/in-memory-attendant-profiles-repository'
import { InMemoryAttendantsRepository } from '@/test/repositories/in-memory-attendants-repository'
import { AuthenticateAttendantUseCase } from '../authenticate-attendant-use-case'

let inMemoryAttendantProfilesRepository: InMemoryAttendantProfilesRepository
let inMemoryAttendantsRepository: InMemoryAttendantsRepository
let fakerHashGenerator: FakeHashService
let fakeDateAdapter: FakeDateAdapter
let fakerEncrypter: FakeEncrypter

let sut: AuthenticateAttendantUseCase

describe('AuthenticateAttendantUseCase', () => {
  beforeEach(() => {
    inMemoryAttendantProfilesRepository =
      new InMemoryAttendantProfilesRepository()
    inMemoryAttendantsRepository = new InMemoryAttendantsRepository(
      inMemoryAttendantProfilesRepository,
    )
    fakerHashGenerator = new FakeHashService()
    fakeDateAdapter = new FakeDateAdapter()
    fakerEncrypter = new FakeEncrypter()

    sut = new AuthenticateAttendantUseCase(
      inMemoryAttendantsRepository,
      fakerHashGenerator,
      fakeDateAdapter,
      fakerEncrypter,
    )
  })

  it('should be able to authenticate an attendant', async () => {
    const attendant = makeAttendant({
      password: await fakerHashGenerator.hash('12345'),
    })

    inMemoryAttendantsRepository.items.push(attendant)

    const response = await sut.execute({
      email: attendant.profile.email,
      password: '12345',
    })

    expect(response.isRight()).toBe(true)
    if (response.isLeft()) return

    const { accessToken, refreshToken } = response.value
    expect(accessToken).toEqual(expect.any(String))
    expect(refreshToken).toEqual(expect.any(String))
  })
})
