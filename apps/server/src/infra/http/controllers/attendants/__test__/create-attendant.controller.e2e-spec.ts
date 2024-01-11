import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/http/database/database.module'
import { PrismaService } from '@/infra/http/database/prisma/prisma.service'
import { WhatsAppFactory } from '@/test/factories/make-whats-app'
import { faker } from '@faker-js/faker'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Create Attendant (HTTP)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let whatsAppsFactory: WhatsAppFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [WhatsAppFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    whatsAppsFactory = moduleRef.get(WhatsAppFactory)

    await app.init()
  })

  it('[POST] /attendants', async () => {
    const whatsApps = [
      await whatsAppsFactory.makePrismaAnswer({}),
      await whatsAppsFactory.makePrismaAnswer({}),
    ]

    const email = faker.internet.email()

    const response = await request(app.getHttpServer())
      .post('/attendants')
      .send({
        email,
        name: faker.person.firstName(),
        displayName: faker.internet.userName(),
        password: faker.string.hexadecimal(),
        whatsAppsIds: whatsApps.map((whatsApp) => whatsApp.id.toString()),
      })

    expect(response.statusCode).toBe(201)

    const attendantOnDatabase = await prisma.attendant.findFirst({
      where: {
        profile: {
          email,
        },
      },
    })

    expect(attendantOnDatabase).toBeTruthy()
    expect(attendantOnDatabase?.whatsAppsIds).toHaveLength(2)
  })
})
