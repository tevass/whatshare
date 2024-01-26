import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WhatsApp } from '@/domain/chat/enterprise/entities/whats-app'
import { AppModule } from '@/infra/app.module'
import { FakeWhatsAppFactory } from '@/test/factories/make-whats-app'
import { Server } from '@/test/utils/server'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import cookieParser from 'cookie-parser'
import { Socket, io } from 'socket.io-client'

import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { WhatsAppStatus } from '@whatshare/core-schemas/enums'
import { WhatsAppServerEvents } from '@whatshare/ws-schemas/events'
import { WWJSClientManager } from '../../wwjs-client-manager.service'
import { WWJSClient } from '../../clients/wwjs-client'
import { EnvService } from '@/infra/env/env.service'

describe('Handle Ready (WWJS)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let env: EnvService

  let whatsApp: WhatsApp

  let socket: Socket<WhatsAppServerEvents>
  let wwjsClient: WWJSClient

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [FakeWhatsAppFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    env = moduleRef.get(EnvService)
    const wwjsManager = moduleRef.get(WWJSClientManager)

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
      socket.on('connect', resolve)
      socket.on('connect_error', reject)
    })
  })

  afterAll(async () => {
    await app.close()
  })

  it('[EVENT] READY', async () => {
    return new Promise((resolve) => {
      socket.on('whatsApp:connected', async ({ whatsApp }) => {
        const whatsAppOnDatabase = await prisma.whatsApp.findUniqueOrThrow({
          where: { id: whatsApp.id },
        })

        resolve([
          expect(wwjsClient.isConnected()).toBe(true),
          expect(whatsApp.isConnected).toBe(true),
          expect(whatsAppOnDatabase.status).toBe('connected' as WhatsAppStatus),
        ])
      })
    })
  })
})
