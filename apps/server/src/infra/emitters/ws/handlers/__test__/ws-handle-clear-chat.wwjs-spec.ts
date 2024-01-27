import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WAEntityID } from '@/core/entities/wa-entity-id'
import { WhatsApp } from '@/domain/chat/enterprise/entities/whats-app'
import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { EnvService } from '@/infra/env/env.service'
import { WWJSClient } from '@/infra/services/wwjs/clients/wwjs-client'
import { WWJSClientManager } from '@/infra/services/wwjs/wwjs-client-manager.service'
import { WWJSClientService } from '@/infra/services/wwjs/wwjs-client.service'
import { FakeAttendantFactory } from '@/test/factories/make-attendant'
import { FakeAttendantProfileFactory } from '@/test/factories/make-attendant-profile'
import { FakeChatFactory } from '@/test/factories/make-chat'
import { FakeContactFactory } from '@/test/factories/make-contact'
import { FakeMessageFactory } from '@/test/factories/make-message'
import { FakeWhatsAppFactory } from '@/test/factories/make-whats-app'
import { Server } from '@/test/utils/server'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { ChatClientEvents } from '@whatshare/ws-schemas/events'
import cookieParser from 'cookie-parser'
import { Socket, io } from 'socket.io-client'

describe('Handle Clear Chat (WS)', () => {
  let app: INestApplication
  let env: EnvService
  let prisma: PrismaService

  let contactFactory: FakeContactFactory
  let chatFactory: FakeChatFactory
  let messageFactory: FakeMessageFactory

  let whatsApp: WhatsApp
  let socket: Socket<ChatClientEvents>

  let wwjsClient: WWJSClient

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        FakeWhatsAppFactory,
        FakeAttendantFactory,
        FakeAttendantProfileFactory,
        FakeChatFactory,
        FakeMessageFactory,
        FakeContactFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    env = moduleRef.get(EnvService)
    prisma = moduleRef.get(PrismaService)

    const wwjsManager = moduleRef.get(WWJSClientManager)
    const wwjsService = moduleRef.get(WWJSClientService)
    const jwt = moduleRef.get(JwtService)

    const whatsAppFactory = moduleRef.get(FakeWhatsAppFactory)
    const attendantFactory = moduleRef.get(FakeAttendantFactory)
    contactFactory = moduleRef.get(FakeContactFactory)
    chatFactory = moduleRef.get(FakeChatFactory)
    messageFactory = moduleRef.get(FakeMessageFactory)

    app.use(cookieParser)
    await app.init()

    const WWJS_TEST_CLIENT_ID = env.get('WWJS_TEST_CLIENT_ID')
    whatsApp = await whatsAppFactory.makePrismaWhatsApp(
      {},
      new UniqueEntityID(WWJS_TEST_CLIENT_ID),
    )

    wwjsClient = wwjsService.createFromWhatsApp(whatsApp)
    wwjsClient.addHandlers(wwjsService.handlers)

    wwjsManager.clients.set(whatsApp.id.toString(), wwjsClient)

    const attendant = await attendantFactory.makePrismaAttendant()
    const JWT_COOKIE_NAME = env.get('JWT_COOKIE_NAME')
    const token = jwt.sign({ sub: attendant.id.toString() })

    const address = Server.getAddressFromApp(app)
    socket = io(`${address}/wa`, {
      extraHeaders: {
        cookie: `${JWT_COOKIE_NAME}=${token}`,
      },
      query: {
        room: whatsApp.id.toString(),
      },
    })

    return new Promise((resolve, reject) => {
      socket.on('connect', () => {
        wwjsClient.init().then(resolve).catch(reject)
      })

      socket.on('connect_error', reject)
    })
  }, 1000 * 30) // 30 seconds

  afterAll(async () => {
    await app.close()
  })

  it('[EVENT] chat:clear', async () => {
    const waClientId = WAEntityID.createFromString(
      wwjsClient.switchToRaw().info.wid._serialized,
    )

    const contact = await contactFactory.makePrismaContact({
      waContactId: waClientId,
    })

    const chat = await chatFactory.makePrismaChat({
      whatsAppId: whatsApp.id,
      waChatId: contact.waContactId,
      contact,
    })

    await Promise.all(
      Array.from(Array(2)).map(() =>
        messageFactory.makePrismaMessage({
          type: 'text',
          ack: 'sent',
          whatsAppId: whatsApp.id,
          chatId: chat.id,
          waChatId: chat.waChatId,
          author: contact,
        }),
      ),
    )

    return new Promise((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      socket.on('exception' as any, reject)

      socket.on('chat:clear', async () => {
        const [chatOnDataBase, messagesOnDatabase] = await Promise.all([
          prisma.chat.findUniqueOrThrow({
            where: { id: chat.id.toString() },
          }),
          prisma.message.findMany({
            where: { chatId: chat.id.toString() },
          }),
        ])

        resolve([
          expect(chatOnDataBase.deletedAt).toBeTruthy(),
          expect(messagesOnDatabase).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                deletedAt: expect.any(Date),
              }),
            ]),
          ),
        ])
      })

      socket.emit('chat:clear', { waChatId: waClientId.toString() })
    })
  })
})
