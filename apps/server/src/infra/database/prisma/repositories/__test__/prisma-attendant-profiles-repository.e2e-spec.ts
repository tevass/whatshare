import {
  FakeAttendantProfileFactory,
  makeAttendantProfile,
} from '@/test/factories/make-attendant-profile'
import { NestTestingApp } from '@/test/utils/nest-testing-app'
import { faker } from '@faker-js/faker'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { PrismaModule } from '../../prisma.module'
import { PrismaService } from '../../prisma.service'
import { PrismaAttendantProfilesRepository } from '../prisma-attendant-profiles-repository'

describe('PrismaAttendantProfilesRepository', () => {
  let app: INestApplication
  let NEST_TESTING_APP: NestTestingApp

  let prisma: PrismaService
  let attendantProfileFactory: FakeAttendantProfileFactory
  let attendantProfilesRepository: PrismaAttendantProfilesRepository

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [
        PrismaAttendantProfilesRepository,
        FakeAttendantProfileFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    NEST_TESTING_APP = new NestTestingApp(app)

    prisma = moduleRef.get(PrismaService)
    attendantProfileFactory = moduleRef.get(FakeAttendantProfileFactory)

    attendantProfilesRepository = moduleRef.get(
      PrismaAttendantProfilesRepository,
    )

    await NEST_TESTING_APP.init()
  })

  beforeEach(async () => {
    await prisma.attendantProfile.deleteMany()
  })

  afterAll(async () => {
    await app.close()
  })

  test('create', async () => {
    const profile = makeAttendantProfile({ attendantId: null })
    await attendantProfilesRepository.create(profile)

    const profileOnDatabase = await prisma.attendantProfile.findUnique({
      where: {
        id: profile.id.toString(),
      },
    })

    expect(profileOnDatabase).toBeTruthy()
  })

  test('save', async () => {
    const profile = await attendantProfileFactory.makePrismaAttendantProfile()

    const displayName = faker.person.firstName()
    profile.set({ displayName })
    await attendantProfilesRepository.save(profile)

    const profileOnDatabase = await prisma.attendantProfile.findUnique({
      where: {
        id: profile.id.toString(),
        displayName,
      },
    })

    expect(profileOnDatabase).toBeTruthy()
  })
})
