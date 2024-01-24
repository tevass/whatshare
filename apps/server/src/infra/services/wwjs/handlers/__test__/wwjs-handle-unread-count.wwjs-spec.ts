import { WhatsApp } from '@/domain/chat/enterprise/entities/whats-app'
import { AppModule } from '@/infra/app.module'
import { FakeWhatsAppFactory } from '@/test/factories/make-whats-app'
import { Server } from '@/test/utils/server'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import cookieParser from 'cookie-parser'
import { Socket, io } from 'socket.io-client'

import { PrismaService } from '@/infra/database/prisma/prisma.service'
import {
  ChatServerEvents,
  WhatsAppServerEvents,
} from '@whatshare/ws-schemas/events'
import { WWJSClientManager } from '../../wwjs-client-manager.service'
import { WWJSClient } from '../../clients/wwjs-client'
import { EnvService } from '@/infra/env/env.service'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WAEntityID } from '@/core/entities/wa-entity-id'
import { FakeChatFactory } from '@/test/factories/make-chat'
import { FakeContactFactory } from '@/test/factories/make-contact'

describe('Handle Unread Count (WWJS)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let env: EnvService
  let wwjsManager: WWJSClientManager

  let contactFactory: FakeContactFactory
  let chatFactory: FakeChatFactory

  let whatsApp: WhatsApp
  let socket: Socket<ChatServerEvents & WhatsAppServerEvents>

  let wwjsClient: WWJSClient

  beforeEach(
    async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [AppModule],
        providers: [FakeWhatsAppFactory, FakeChatFactory, FakeContactFactory],
      }).compile()

      app = moduleRef.createNestApplication()

      prisma = moduleRef.get(PrismaService)
      env = moduleRef.get(EnvService)
      wwjsManager = moduleRef.get(WWJSClientManager)

      contactFactory = app.get(FakeContactFactory)
      chatFactory = app.get(FakeChatFactory)
      const whatsAppFactory = app.get(FakeWhatsAppFactory)

      const WWJS_TEST_CLIENT_ID = env.get('WWJS_TEST_CLIENT_ID')
      whatsApp = await whatsAppFactory.makePrismaWhatsApp(
        {},
        new UniqueEntityID(WWJS_TEST_CLIENT_ID),
      )

      app.use(cookieParser)
      await app.init()

      wwjsClient = wwjsManager.clients.get(whatsApp.id.toString())!

      const address = Server.getAddressFromApp(app)
      socket = io(`${address}/wa`, {
        query: {
          room: whatsApp.id.toString(),
        },
      })

      return new Promise((resolve, reject) => {
        socket.on('connect', () => {
          socket.on('whatsApp:connected', () => resolve())
        })

        socket.on('connect_error', reject)
      })
    },
    1000 * 60 * 1,
  ) // 1 minute

  afterAll(async () => {
    await app.close()
  })

  it('[EVENT] UNREAD_COUNT', async () => {
    const WWJS_TEST_HELPER_CLIENT_WAID = env.get(
      'WWJS_TEST_HELPER_CLIENT_WAID',
    )!

    const helpWAId = WAEntityID.createFromString(WWJS_TEST_HELPER_CLIENT_WAID)

    const contact = await contactFactory.makePrismaContact({
      waContactId: helpWAId,
    })

    await chatFactory.makePrismaChat({
      waChatId: helpWAId,
      whatsAppId: whatsApp.id,
      contact,
      unreadCount: 0,
    })

    return new Promise((resolve) => {
      socket.on('chat:change', async ({ chat }) => {
        const chatOnDatabase = await prisma.chat.findUniqueOrThrow({
          where: { id: chat.id },
        })

        resolve([
          expect(chatOnDatabase.unreadCount).toBe(-1),
          expect(chat.unreadCount).toBe(-1),
        ])
      })

      wwjsClient.chat.markUnreadById(helpWAId)
    })
  })
})
