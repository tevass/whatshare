import { AppModule } from '@/infra/app.module'
import { FakeAttendantFactory } from '@/test/factories/make-attendant'
import { FakeAttendantProfileFactory } from '@/test/factories/make-attendant-profile'
import { FakeContactFactory } from '@/test/factories/make-contact'
import { FakeWhatsAppFactory } from '@/test/factories/make-whats-app'
import { NestTestingApp } from '@/test/utils/nest-testing-app'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import console from 'console'
import supertest from 'supertest'

describe('Get Contact (HTTP)', () => {
  let app: INestApplication
  let NEST_TESTING_APP: NestTestingApp

  let contactsFactory: FakeContactFactory
  let attendantFactory: FakeAttendantFactory

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        FakeWhatsAppFactory,
        FakeContactFactory,
        FakeAttendantProfileFactory,
        FakeAttendantFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    NEST_TESTING_APP = new NestTestingApp(app)

    contactsFactory = moduleRef.get(FakeContactFactory)
    attendantFactory = moduleRef.get(FakeAttendantFactory)

    await NEST_TESTING_APP.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('[GET] /contacts/:contactId', async () => {
    const attendant = await attendantFactory.makePrismaAttendant()

    const accessToken = NEST_TESTING_APP.authenticate({
      sub: attendant.id.toString(),
    })

    const contact = await contactsFactory.makePrismaContact()
    const contactId = contact.id.toString()

    const response = await supertest(app.getHttpServer())
      .get(`/contacts/${contactId}`)
      .set('Cookie', NEST_TESTING_APP.getAuthCookie(accessToken))
      .send()

    console.log(response.error)

    // expect(response.statusCode).toBe(200)
    // expect(response.body.contact).toBeTruthy()
  })
})
