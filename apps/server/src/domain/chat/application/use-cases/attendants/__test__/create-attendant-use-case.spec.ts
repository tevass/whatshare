import { FakeHashService } from '@/test/cryptography/faker-hash-service'
import { makeWhatsApp } from '@/test/factories/make-whats-app'
import { InMemoryAttendantProfilesRepository } from '@/test/repositories/in-memory-attendant-profiles-repository'
import { InMemoryAttendantsRepository } from '@/test/repositories/in-memory-attendants-repository'
import { InMemoryWhatsAppsRepository } from '@/test/repositories/in-memory-whats-apps-repository'
import { faker } from '@faker-js/faker'
import { CreateAttendantUseCase } from '../create-attendant-use-case'

let inMemoryAttendantProfilesRepository: InMemoryAttendantProfilesRepository
let inMemoryAttendantsRepository: InMemoryAttendantsRepository
let inMemoryWhatsAppsRepository: InMemoryWhatsAppsRepository
let fakerHashGenerator: FakeHashService

let sut: CreateAttendantUseCase

describe('CreateAttendantUseCase', () => {
  beforeEach(() => {
    inMemoryAttendantProfilesRepository =
      new InMemoryAttendantProfilesRepository()
    inMemoryAttendantsRepository = new InMemoryAttendantsRepository(
      inMemoryAttendantProfilesRepository,
    )
    inMemoryWhatsAppsRepository = new InMemoryWhatsAppsRepository()
    fakerHashGenerator = new FakeHashService()

    sut = new CreateAttendantUseCase(
      inMemoryAttendantProfilesRepository,
      inMemoryAttendantsRepository,
      inMemoryWhatsAppsRepository,
      fakerHashGenerator,
    )
  })

  it('should be able to create a new attendant', async () => {
    const whatsApps = Array.from(Array(2)).map(() => makeWhatsApp())
    inMemoryWhatsAppsRepository.items.push(...whatsApps)

    const response = await sut.execute({
      email: faker.internet.email(),
      name: faker.person.firstName(),
      displayName: faker.person.firstName(),
      password: faker.string.hexadecimal(),
      whatsAppsIds: whatsApps.map((whatsApp) => whatsApp.id.toString()),
    })

    expect(response.isRight()).toBe(true)
    if (response.isLeft()) return

    const { attendant } = response.value
    expect(attendant).toEqual(inMemoryAttendantsRepository.items[0])
    expect(attendant.whatsAppsList.getItems()).toHaveLength(2)
  })

  it('should be able to hash of attendant password before create', async () => {
    const response = await sut.execute({
      email: faker.internet.email(),
      name: faker.person.firstName(),
      displayName: faker.person.firstName(),
      password: '123456',
      whatsAppsIds: [],
    })

    expect(response.isRight()).toBe(true)
    if (response.isLeft()) return

    const { attendant } = response.value

    const hashedPassword = await fakerHashGenerator.hash('123456')
    expect(attendant.password).toEqual(hashedPassword)
  })
})
