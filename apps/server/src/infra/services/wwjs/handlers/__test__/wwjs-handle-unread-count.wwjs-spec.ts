import { WhatsApp } from '@/domain/chat/enterprise/entities/whats-app'
import { AppModule } from '@/infra/app.module'
import { FakeWhatsAppFactory } from '@/test/factories/make-whats-app'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { Socket } from 'socket.io-client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WAEntityID } from '@/core/entities/wa-entity-id'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { EnvService } from '@/infra/env/env.service'
import { FakeContactFactory } from '@/test/factories/make-contact'
import { NestTestingApp } from '@/test/utils/nest-testing-app'
import { WsTestingClient } from '@/test/utils/ws-testing-client'
import {
  ChatServerEvents,
  WhatsAppServerEvents,
} from '@whatshare/ws-schemas/events'
import { WWJSClient } from '../../clients/wwjs-client'
import { WWJSClientManager } from '../../wwjs-client-manager.service'
import { WWJSClientService } from '../../wwjs-client.service'
import { WWJSHandleUnreadCount } from '../wwjs-handle-unread-count'
import { FakePrivateChatFactory } from '@/test/factories/make-private-chat'

describe('Handle Unread Count (WWJS)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let env: EnvService

  let contactFactory: FakeContactFactory
  let privateChatFactory: FakePrivateChatFactory

  let whatsApp: WhatsApp
  let socket: Socket<ChatServerEvents & WhatsAppServerEvents>

  let wwjsClient: WWJSClient

  beforeEach(
    async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [AppModule],
        providers: [
          FakeWhatsAppFactory,
          FakePrivateChatFactory,
          FakeContactFactory,
        ],
      }).compile()

      app = moduleRef.createNestApplication()
      const NEST_TESTING_APP = new NestTestingApp(app)

      prisma = moduleRef.get(PrismaService)
      env = moduleRef.get(EnvService)

      contactFactory = moduleRef.get(FakeContactFactory)
      privateChatFactory = moduleRef.get(FakePrivateChatFactory)

      const wwjsManager = moduleRef.get(WWJSClientManager)
      const whatsAppFactory = moduleRef.get(FakeWhatsAppFactory)
      const wwjsService = moduleRef.get(WWJSClientService)

      await NEST_TESTING_APP.init()

      const WWJS_TEST_CLIENT_ID = env.get('WWJS_TEST_CLIENT_ID')
      whatsApp = await whatsAppFactory.makePrismaWhatsApp(
        {},
        new UniqueEntityID(WWJS_TEST_CLIENT_ID),
      )

      wwjsClient = wwjsService.createFromWhatsApp(whatsApp)
      wwjsClient.addHandlers([moduleRef.get(WWJSHandleUnreadCount)])
      wwjsManager.clients.set(whatsApp.id.toString(), wwjsClient)

      socket = WsTestingClient.create({
        address: WsTestingClient.waAddress(NEST_TESTING_APP.getAddress(app)),
        cookie: NEST_TESTING_APP.getAuthCookie('@test'),
        room: whatsApp.id.toString(),
      })

      return new Promise((resolve, reject) => {
        socket.on('connect', () => {
          wwjsClient.init().then(resolve)
        })

        socket.on('connect_error', reject)
      })
    },
    1000 * 60 * 1, // 1 minute
  )

  afterAll(async () => {
    await app.close()
  })

  it('[EVENT] UNREAD_COUNT', async () => {
    const WWJS_TEST_HELPER_CLIENT_WAID = env.get(
      'WWJS_TEST_HELPER_CLIENT_WAID',
    )!

    const helperWAId = WAEntityID.createFromString(WWJS_TEST_HELPER_CLIENT_WAID)

    const contact = await contactFactory.makePrismaContact({
      waContactId: helperWAId,
    })

    await privateChatFactory.makePrismaPrivateChat({
      waChatId: helperWAId,
      whatsAppId: whatsApp.id,
      contact,
      unreadCount: 0,
    })

    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      socket.on('chat:change', async ({ chat }) => {
        const chatOnDatabase = await prisma.chat.findUniqueOrThrow({
          where: { id: chat.id },
        })

        resolve([
          expect(chatOnDatabase.unreadCount).toBe(-1),
          expect(chat.unreadCount).toBe(-1),
        ])
      })

      await wwjsClient.chat.markUnreadById(helperWAId)
    })
  })
})
