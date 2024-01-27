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
import { NestTestingApp } from '@/test/utils/nest-testing-app'
import { WsTestingClient } from '@/test/utils/ws-testing-client'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import {
  ChatClientEvents,
  ChatServerEvents,
} from '@whatshare/ws-schemas/events'
import { Socket } from 'socket.io-client'

describe('Handle Read Chat (WS)', () => {
  let app: INestApplication
  let prisma: PrismaService

  let contactFactory: FakeContactFactory
  let chatFactory: FakeChatFactory

  let whatsApp: WhatsApp
  let socket: Socket<ChatServerEvents, ChatClientEvents>

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
    const NEST_TESTING_APP = new NestTestingApp(app)

    const env = moduleRef.get(EnvService)
    prisma = moduleRef.get(PrismaService)

    const wwjsManager = moduleRef.get(WWJSClientManager)
    const wwjsService = moduleRef.get(WWJSClientService)

    const whatsAppFactory = moduleRef.get(FakeWhatsAppFactory)
    const attendantFactory = moduleRef.get(FakeAttendantFactory)
    contactFactory = moduleRef.get(FakeContactFactory)
    chatFactory = moduleRef.get(FakeChatFactory)

    await NEST_TESTING_APP.init()

    const WWJS_TEST_CLIENT_ID = env.get('WWJS_TEST_CLIENT_ID')
    whatsApp = await whatsAppFactory.makePrismaWhatsApp(
      {},
      new UniqueEntityID(WWJS_TEST_CLIENT_ID),
    )

    wwjsClient = wwjsService.createFromWhatsApp(whatsApp)
    wwjsManager.clients.set(whatsApp.id.toString(), wwjsClient)

    const attendant = await attendantFactory.makePrismaAttendant()
    const token = NEST_TESTING_APP.authenticate({
      sub: attendant.id.toString(),
    })

    socket = WsTestingClient.create({
      address: WsTestingClient.waAddress(NEST_TESTING_APP.getAddress(app)),
      cookie: NEST_TESTING_APP.getAuthCookie(token),
      room: whatsApp.id.toString(),
    })

    return new Promise((resolve, reject) => {
      socket.on('connect', () => {
        wwjsClient
          .init()
          .then(() => {
            wwjsClient.set({ status: 'connected' })
            resolve()
          })
          .catch(reject)
      })

      socket.on('connect_error', reject)
    })
  }, 1000 * 30) // 30 seconds

  afterAll(async () => {
    await app.close()
  })

  it('[EVENT] chat:read', async () => {
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
      unreadCount: 1,
    })

    return new Promise((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      socket.on('exception' as any, reject)

      socket.on('chat:change', async () => {
        const [chatOnDataBase] = await Promise.all([
          prisma.chat.findUniqueOrThrow({
            where: { id: chat.id.toString() },
          }),
        ])

        resolve([expect(chatOnDataBase.unreadCount).toBe(0)])
      })

      socket.emit('chat:read', { waChatId: waClientId.toString() })
    })
  })
})
