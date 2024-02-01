import { AppModule } from '@/infra/app.module'
import { FakeAttendantFactory } from '@/test/factories/make-attendant'
import { FakeAttendantProfileFactory } from '@/test/factories/make-attendant-profile'
import { FakeContactFactory } from '@/test/factories/make-contact'
import { FakePrivateChatFactory } from '@/test/factories/make-private-chat'
import { FakePrivateMessageFactory } from '@/test/factories/make-private-message'
import { FakeWhatsAppFactory } from '@/test/factories/make-whats-app'
import { NestTestingApp } from '@/test/utils/nest-testing-app'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import supertest from 'supertest'

describe('Fetch Messages (HTTP)', () => {
  let app: INestApplication
  let NEST_TESTING_APP: NestTestingApp

  let whatsAppFactory: FakeWhatsAppFactory
  let privateChatsFactory: FakePrivateChatFactory
  let privateMessagesFactory: FakePrivateMessageFactory
  let attendantFactory: FakeAttendantFactory

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        FakeWhatsAppFactory,
        FakeContactFactory,
        FakePrivateChatFactory,
        FakePrivateMessageFactory,
        FakeAttendantProfileFactory,
        FakeAttendantFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    NEST_TESTING_APP = new NestTestingApp(app)

    whatsAppFactory = moduleRef.get(FakeWhatsAppFactory)
    privateChatsFactory = moduleRef.get(FakePrivateChatFactory)
    privateMessagesFactory = moduleRef.get(FakePrivateMessageFactory)
    attendantFactory = moduleRef.get(FakeAttendantFactory)

    await NEST_TESTING_APP.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('[GET] /wa/messages', async () => {
    const attendant = await attendantFactory.makePrismaAttendant()

    const accessToken = NEST_TESTING_APP.authenticate({
      sub: attendant.id.toString(),
    })

    const whatsApp = await whatsAppFactory.makePrismaWhatsApp()
    const chat = await privateChatsFactory.makePrismaPrivateChat()

    await Promise.all(
      Array.from(Array(2)).map(() =>
        privateMessagesFactory.makePrismaPrivateMessage({
          whatsAppId: whatsApp.id,
          chatId: chat.id,
          waChatId: chat.waChatId,
        }),
      ),
    )

    const response = await supertest(app.getHttpServer())
      .get('/wa/messages')
      .set('Cookie', NEST_TESTING_APP.getAuthCookie(accessToken))
      .query({
        chatId: chat.id.toString(),
      })
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.messages).toHaveLength(2)
  })
})
