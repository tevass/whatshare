import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { WhatsApp } from '@/domain/chat/enterprise/entities/whats-app'
import { AppModule } from '@/infra/app.module'
import { FakeWhatsAppFactory } from '@/test/factories/make-whats-app'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { Socket } from 'socket.io-client'

import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { EnvService } from '@/infra/env/env.service'
import { NestTestingApp } from '@/test/utils/nest-testing-app'
import { WsTestingClient } from '@/test/utils/ws-testing-client'
import { WhatsAppStatus } from '@whatshare/core-schemas/enums'
import { WhatsAppServerEvents } from '@whatshare/ws-schemas/events'
import { WWJSClient } from '../../clients/wwjs-client'
import { WWJSClientManager } from '../../wwjs-client-manager.service'

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
    const NEST_TESTING_APP = new NestTestingApp(app)

    prisma = moduleRef.get(PrismaService)
    env = moduleRef.get(EnvService)
    const wwjsManager = moduleRef.get(WWJSClientManager)

    const whatsAppFactory = moduleRef.get(FakeWhatsAppFactory)

    const WWJS_TEST_CLIENT_ID = env.get('WWJS_TEST_CLIENT_ID')
    whatsApp = await whatsAppFactory.makePrismaWhatsApp(
      {},
      new UniqueEntityID(WWJS_TEST_CLIENT_ID),
    )

    await NEST_TESTING_APP.init()

    wwjsClient = wwjsManager.clients.get(whatsApp.id.toString())!

    socket = WsTestingClient.create({
      address: WsTestingClient.waAddress(NEST_TESTING_APP.getAddress(app)),
      cookie: NEST_TESTING_APP.getAuthCookie('@test'),
      room: whatsApp.id.toString(),
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
