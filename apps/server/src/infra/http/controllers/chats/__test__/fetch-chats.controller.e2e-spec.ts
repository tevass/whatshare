import { AppModule } from '@/infra/app.module'
import { FakeAttendantFactory } from '@/test/factories/make-attendant'
import { FakeAttendantProfileFactory } from '@/test/factories/make-attendant-profile'
import { FakeChatFactory } from '@/test/factories/make-chat'
import { FakeContactFactory } from '@/test/factories/make-contact'
import { FakeWhatsAppFactory } from '@/test/factories/make-whats-app'
import { NestTestingApp } from '@/test/utils/nest-testing-app'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { expect } from 'vitest'

describe('Fetch Chats (HTTP)', () => {
  let app: INestApplication
  let NEST_TESTING_APP: NestTestingApp

  let whatsAppFactory: FakeWhatsAppFactory
  let chatsFactory: FakeChatFactory
  let attendantFactory: FakeAttendantFactory

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        FakeWhatsAppFactory,
        FakeContactFactory,
        FakeChatFactory,
        FakeAttendantProfileFactory,
        FakeAttendantFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    NEST_TESTING_APP = new NestTestingApp(app)

    whatsAppFactory = moduleRef.get(FakeWhatsAppFactory)
    chatsFactory = moduleRef.get(FakeChatFactory)
    attendantFactory = moduleRef.get(FakeAttendantFactory)

    await NEST_TESTING_APP.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('[GET] /wa/chats', async () => {
    const attendant = await attendantFactory.makePrismaAttendant()

    const accessToken = NEST_TESTING_APP.authenticate({
      sub: attendant.id.toString(),
    })

    const whatsApp = await whatsAppFactory.makePrismaWhatsApp()

    await Promise.all(
      Array.from(Array(2)).map(() =>
        chatsFactory.makePrismaChat({ whatsAppId: whatsApp.id }),
      ),
    )

    const response = await request(app.getHttpServer())
      .get('/wa/chats')
      .set('Cookie', NEST_TESTING_APP.getAuthCookie(accessToken))
      .query({
        whatsAppId: whatsApp.id.toString(),
      })

    expect(response.statusCode).toBe(200)
    expect(response.body.chats).toHaveLength(2)
  })
})
