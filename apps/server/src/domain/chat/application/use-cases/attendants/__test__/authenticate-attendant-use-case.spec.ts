import { FakeEncrypter } from '@/test/cryptography/faker-encrypter'
import { FakeHashService } from '@/test/cryptography/faker-hash-service'
import { makeAttendant } from '@/test/factories/make-attendant'
import { InMemoryAttendantsRepository } from '@/test/repositories/in-memory-attendants-repository'
import { AuthenticateAttendantUseCase } from '../authenticate-attendant-use-case'

let inMemoryAttendantsRepository: InMemoryAttendantsRepository
let fakerHashGenerator: FakeHashService
let fakerEncrypter: FakeEncrypter

let sut: AuthenticateAttendantUseCase

describe('AuthenticateAttendantUseCase', () => {
  beforeEach(() => {
    inMemoryAttendantsRepository = inMemoryAttendantsRepository =
      new InMemoryAttendantsRepository()
    fakerHashGenerator = new FakeHashService()
    fakerEncrypter = new FakeEncrypter()

    sut = new AuthenticateAttendantUseCase(
      inMemoryAttendantsRepository,
      fakerHashGenerator,
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
