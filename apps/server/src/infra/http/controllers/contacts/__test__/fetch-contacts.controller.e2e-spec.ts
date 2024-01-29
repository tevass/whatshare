import { AppModule } from '@/infra/app.module'
import { FakeAttendantFactory } from '@/test/factories/make-attendant'
import { FakeAttendantProfileFactory } from '@/test/factories/make-attendant-profile'
import { FakeContactFactory } from '@/test/factories/make-contact'
import { FakeWhatsAppFactory } from '@/test/factories/make-whats-app'
import { NestTestingApp } from '@/test/utils/nest-testing-app'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import supertest from 'supertest'
import { expect } from 'vitest'

describe('Fetch Contacts (HTTP)', () => {
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

  it('[GET] /contacts', async () => {
    const attendant = await attendantFactory.makePrismaAttendant()

    const accessToken = NEST_TESTING_APP.authenticate({
      sub: attendant.id.toString(),
    })

    await Promise.all(
      Array.from(Array(2)).map(() => contactsFactory.makePrismaContact()),
    )

    const response = await supertest(app.getHttpServer())
      .get('/contacts')
      .set('Cookie', NEST_TESTING_APP.getAuthCookie(accessToken))
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.contacts).toHaveLength(2)
  })
})
