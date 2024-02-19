import { makeUniqueEntityID } from '@/test/factories/make-unique-entity-id'
import { FakeWhatsAppFactory } from '@/test/factories/make-whats-app'
import { NestTestingApp } from '@/test/utils/nest-testing-app'
import { faker } from '@faker-js/faker'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { PrismaModule } from '../../prisma.module'
import { PrismaService } from '../../prisma.service'
import { PrismaWhatsAppsRepository } from '../prisma-whats-apps-repository'

describe('PrismaWhatsAppsRepository', () => {
  let app: INestApplication
  let NEST_TESTING_APP: NestTestingApp

  let prisma: PrismaService
  let whatsAppFactory: FakeWhatsAppFactory
  let whatsAppsRepository: PrismaWhatsAppsRepository

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [PrismaWhatsAppsRepository, FakeWhatsAppFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    NEST_TESTING_APP = new NestTestingApp(app)

    prisma = moduleRef.get(PrismaService)
    whatsAppFactory = moduleRef.get(FakeWhatsAppFactory)
    whatsAppsRepository = moduleRef.get(PrismaWhatsAppsRepository)

    await NEST_TESTING_APP.init()
  })

  beforeEach(async () => {
    await prisma.whatsApp.deleteMany()
  })

  afterAll(async () => {
    await app.close()
  })

  test('save', async () => {
    const whatsApp = await whatsAppFactory.makePrismaWhatsApp()

    const name = faker.company.name()
    whatsApp.set({ name })

    await whatsAppsRepository.save(whatsApp)

    const whatsappOnDatabase = await prisma.whatsApp.findUnique({
      where: {
        id: whatsApp.id.toString(),
        name,
      },
    })

    expect(whatsappOnDatabase).toBeTruthy()
  })

  test('findAll', async () => {
    const rowsLength = 2
    await Promise.all(
      Array.from(Array(rowsLength)).map(() =>
        whatsAppFactory.makePrismaWhatsApp(),
      ),
    )

    const whatsApps = await whatsAppsRepository.findAll()
    expect(whatsApps).toHaveLength(rowsLength)
  })

  test('findManyByIds', async () => {
    const rowsLength = 2
    const whatsAppIds = Array.from(Array(rowsLength)).map(() =>
      makeUniqueEntityID(),
    )

    await Promise.all(
      whatsAppIds.map((whatsAppId) =>
        whatsAppFactory.makePrismaWhatsApp({}, whatsAppId),
      ),
    )

    const whatsApps = await whatsAppsRepository.findManyByIds({
      ids: whatsAppIds.map((id) => id.toString()),
    })

    expect(whatsApps).toHaveLength(rowsLength)
  })

  test('findById', async () => {
    const whatsAppId = makeUniqueEntityID()
    await whatsAppFactory.makePrismaWhatsApp({}, whatsAppId)

    const whatsApp = await whatsAppsRepository.findById({
      id: whatsAppId.toString(),
    })

    expect(whatsApp).toBeTruthy()
  })
})
