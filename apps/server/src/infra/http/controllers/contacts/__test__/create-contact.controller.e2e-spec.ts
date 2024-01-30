import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { FakeAttendantFactory } from '@/test/factories/make-attendant'
import { FakeAttendantProfileFactory } from '@/test/factories/make-attendant-profile'
import { FakeWhatsAppFactory } from '@/test/factories/make-whats-app'
import { NestTestingApp } from '@/test/utils/nest-testing-app'
import { faker } from '@faker-js/faker'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import supertest from 'supertest'

describe('Create Contact (HTTP)', () => {
  let app: INestApplication
  let NEST_TESTING_APP: NestTestingApp
  let prisma: PrismaService

  let attendantFactory: FakeAttendantFactory

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        FakeWhatsAppFactory,
        FakeAttendantProfileFactory,
        FakeAttendantFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    NEST_TESTING_APP = new NestTestingApp(app)
    prisma = moduleRef.get(PrismaService)

    attendantFactory = moduleRef.get(FakeAttendantFactory)

    await NEST_TESTING_APP.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('[POST] /contacts', async () => {
    const attendant = await attendantFactory.makePrismaAttendant()

    const accessToken = NEST_TESTING_APP.authenticate({
      sub: attendant.id.toString(),
    })

    const number = faker.helpers.fromRegExp(/[0-9]{13}/)

    const response = await supertest(app.getHttpServer())
      .post('/contacts')
      .set('Cookie', NEST_TESTING_APP.getAuthCookie(accessToken))
      .send({
        name: faker.person.firstName(),
        number,
      })

    expect(response.statusCode).toBe(201)

    const contact = await prisma.contact.findUnique({
      where: {
        phone: number,
      },
    })

    expect(contact).toBeTruthy()
  })
})
