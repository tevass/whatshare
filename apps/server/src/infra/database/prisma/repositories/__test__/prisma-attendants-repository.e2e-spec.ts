import {
  FakeAttendantFactory,
  makeAttendant,
} from '@/test/factories/make-attendant'
import { FakeAttendantProfileFactory } from '@/test/factories/make-attendant-profile'
import { NestTestingApp } from '@/test/utils/nest-testing-app'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { PrismaModule } from '../../prisma.module'
import { PrismaService } from '../../prisma.service'
import { PrismaAttendantsRepository } from '../prisma-attendants-repository'

describe('PrismaAttendantsRepository', () => {
  let app: INestApplication
  let NEST_TESTING_APP: NestTestingApp

  let prisma: PrismaService
  let attendantProfileFactory: FakeAttendantProfileFactory
  let attendantFactory: FakeAttendantFactory

  let attendantsRepository: PrismaAttendantsRepository

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [
        PrismaAttendantsRepository,
        FakeAttendantProfileFactory,
        FakeAttendantFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    NEST_TESTING_APP = new NestTestingApp(app)

    prisma = moduleRef.get(PrismaService)
    attendantFactory = moduleRef.get(FakeAttendantFactory)
    attendantProfileFactory = moduleRef.get(FakeAttendantProfileFactory)
    attendantsRepository = moduleRef.get(PrismaAttendantsRepository)

    await NEST_TESTING_APP.init()
  })

  beforeEach(async () => {
    await prisma.attendant.deleteMany()
  })

  afterAll(async () => {
    await app.close()
  })

  test('create', async () => {
    const profile = await attendantProfileFactory.makePrismaAttendantProfile()

    const attendant = makeAttendant({ profile })

    await attendantsRepository.create(attendant)
    const attendantOnDatabase = await prisma.attendant.findUnique({
      where: {
        id: attendant.id.toString(),
      },
    })

    expect(attendantOnDatabase).toBeTruthy()
  })

  test('findById', async () => {
    const attendant = await attendantFactory.makePrismaAttendant()

    const attendantOnDatabase = await attendantsRepository.findById({
      id: attendant.id.toString(),
    })

    expect(attendantOnDatabase).toBeTruthy()
    expect(attendantOnDatabase?.profile).toBeTruthy()
  })

  test('findByEmail', async () => {
    const attendant = await attendantFactory.makePrismaAttendant()

    const attendantOnDatabase = await attendantsRepository.findByEmail({
      email: attendant.profile.email,
    })

    expect(attendantOnDatabase).toBeTruthy()
  })
})
