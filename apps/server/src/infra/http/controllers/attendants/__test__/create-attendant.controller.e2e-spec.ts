import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { EnvService } from '@/infra/env/env.service'
import { FakeAttendant } from '@/test/factories/make-attendant'
import { FakeAttendantProfile } from '@/test/factories/make-attendant-profile'
import { WhatsAppFactory } from '@/test/factories/make-whats-app'
import { faker } from '@faker-js/faker'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import cookieParser from 'cookie-parser'
import request from 'supertest'

describe('Create Attendant (HTTP)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let whatsAppsFactory: WhatsAppFactory
  let attendantFactory: FakeAttendant
  let jwt: JwtService
  let env: EnvService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [WhatsAppFactory, FakeAttendant, FakeAttendantProfile],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    whatsAppsFactory = moduleRef.get(WhatsAppFactory)
    attendantFactory = app.get(FakeAttendant)
    jwt = app.get(JwtService)
    env = app.get(EnvService)

    app.use(cookieParser())

    await app.init()
  })

  it('[POST] /attendants', async () => {
    const attendant = await attendantFactory.makePrismaAttendant()

    const accessToken = jwt.sign({ sub: attendant.id.toString() })
    const JWT_COOKIE_NAME = env.get('JWT_COOKIE_NAME')

    const whatsApps = [
      await whatsAppsFactory.makePrismaAnswer({}),
      await whatsAppsFactory.makePrismaAnswer({}),
    ]

    const email = faker.internet.email()

    const response = await request(app.getHttpServer())
      .post('/attendants')
      .set('Cookie', [`${JWT_COOKIE_NAME}=${accessToken}`])
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